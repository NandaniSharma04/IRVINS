package com.irvins.backend.controller;

import com.irvins.backend.entity.Master;
import com.irvins.backend.repository.MasterRepository;
import com.irvins.backend.service.ComplaintTagService;
import com.irvins.backend.service.EmbeddingService;
import com.irvins.backend.dto.SimilarComplaintDTO;
import com.irvins.backend.dto.TagRequest;
import com.irvins.backend.dto.ComplaintTagResponse;
import com.irvins.backend.dto.CategoryStatsDTO;
import com.irvins.backend.entity.AIComplaint;
import com.irvins.backend.repository.AIComplaintRepository;
import com.irvins.backend.service.DashboardService;
import com.irvins.backend.service.CategoryDetectionService;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ComplaintController {

    @Autowired
    private MasterRepository masterRepository;

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private AIComplaintRepository aiComplaintRepository;

    @Autowired
    private ComplaintTagService service;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private CategoryDetectionService categoryDetectionService;

    // =====================================================
    // GET TAG DETAILS
    // =====================================================

    @GetMapping("/tag-details/{complaintNo}")
    public ResponseEntity<?> getComplaintTagDetails(
            @PathVariable String complaintNo
    ) {

        Master complaint =
                masterRepository.findByComplaintNo(
                        complaintNo.trim()
                );

        if (complaint == null) {
            return ResponseEntity
                    .status(404)
                    .body("Complaint not found");
        }

        var tags =
                service.getTagsByComplaintId(
                        complaint.getId()
                );

        return ResponseEntity.ok(

                new ComplaintTagResponse(
                        complaint.getSenderName(),
                        complaint.getComplaintNo(),
                        tags
                )
        );
    }

    // =====================================================
    // GET SIMILAR COMPLAINTS FROM EXISTING COMPLAINT
    // =====================================================

    @GetMapping("/similar-from-complaint/{complaintNo}")
    public ResponseEntity<?> getSimilarFromComplaint(
            @PathVariable String complaintNo,
            @RequestParam(defaultValue = "5") int k
    ) {

        Master complaint =
                masterRepository.findByComplaintNo(
                        complaintNo.trim()
                );

        if (complaint == null) {
            return ResponseEntity
                    .status(404)
                    .body("Complaint not found");
        }

        // combine subject + details
        String combinedText =
                complaint.getSubject() + " "
                        + complaint.getDetails();

        // generate embedding
        float[] queryVector =
                embeddingService.getEmbedding(
                        combinedText
                );

        String vectorString =
                Arrays.toString(queryVector);

        // fetch nearest complaints
        List<AIComplaint> results =
                aiComplaintRepository.findTopKByVector(
                        vectorString,
                        k
                );

        List<SimilarComplaintDTO> similar =
                results.stream()

                        .map(ai -> {

                            double distance =
                                    ai.getDistance();

                            if (Double.isNaN(distance)
                                    || Double.isInfinite(distance)) {

                                distance = 1.0;
                            }

                            double similarity =
                                    (1.0 - distance) * 100;

                            Master master =
                                    masterRepository
                                            .findByComplaintNo(
                                                    ai.getComplaintNo()
                                            );

                            // skip same complaint
                            if (master == null
                                    || master.getComplaintNo()
                                    .equals(complaintNo)) {

                                return null;
                            }

                            return new SimilarComplaintDTO(

                                    master.getId(),

                                    ai.getComplaintNo(),

                                    ai.getSubject(),

                                    ai.getDetails(),

                                    ai.getSenderName(),

                                    similarity
                            );

                        })

                        .filter(x -> x != null)

                        .collect(Collectors.toList());

        return ResponseEntity.ok(similar);
    }

    // =====================================================
    // DASHBOARD STATS
    // =====================================================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {

        try {

            CategoryStatsDTO stats =
                    dashboardService.getCategoryStats();

            return ResponseEntity.ok(stats);

        } catch (Exception ex) {

            return ResponseEntity
                    .status(500)
                    .body(
                            "Error fetching dashboard stats: "
                                    + ex.getMessage()
                    );
        }
    }

    // =====================================================
    // SAVE COMPLAINT
    // =====================================================

    @PostMapping("/save")
    public ResponseEntity<?> saveComplaint(
            @RequestBody Master complaint
    ) {

        if (complaint == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid complaint data");
        }

        if (complaint.getComplaintNo() == null
                || complaint.getComplaintNo().isEmpty()) {

            complaint.setComplaintNo(
                    "C-" + System.currentTimeMillis()
            );
        }

        // =================================================
        // AUTO CATEGORIZE COMPLAINT
        // =================================================

        CategoryDetectionService.CategoryDetectionResult
                categoryResult =

                categoryDetectionService.detectCategory(

                        complaint.getSubject(),

                        complaint.getDetails()
                );

        complaint.setMainCategory(
                categoryResult.mainCategory
        );

        complaint.setSubcategory(
                categoryResult.subcategory
        );

        complaint.setCategoryConfidence(
                categoryResult.confidence
        );

        complaint.setAutoCategorized(true);

        // =================================================
        // SAVE MAIN COMPLAINT
        // =================================================

        masterRepository.save(complaint);

        // =================================================
        // GENERATE EMBEDDING
        // =================================================

        String combinedText =
                complaint.getSubject()
                        + " "
                        + complaint.getDetails();

        float[] embedding =
                embeddingService.getEmbedding(
                        combinedText
                );

        // =================================================
        // SAVE AI COMPLAINT
        // =================================================

        AIComplaint aiComplaint =
                new AIComplaint();

        aiComplaint.setComplaintNo(
                complaint.getComplaintNo()
        );

        aiComplaint.setSubject(
                complaint.getSubject()
        );

        aiComplaint.setDetails(
                complaint.getDetails()
        );

        aiComplaint.setSenderName(
                complaint.getSenderName()
        );

        aiComplaint.setEmbedding(
                embedding
        );

        aiComplaintRepository.save(aiComplaint);

        return ResponseEntity.ok(
                complaint.getId()
        );
    }

    // =====================================================
    // FIND SIMILAR
    // =====================================================

    @GetMapping("/similar")
    public List<SimilarComplaintDTO> findSimilarComplaints(

            @RequestParam String text,

            @RequestParam Long currentId,

            @RequestParam(defaultValue = "5") int k
    ) {

        float[] queryVector =
                embeddingService.getEmbedding(text);

        String vectorString =
                Arrays.toString(queryVector);

        List<AIComplaint> results =
                aiComplaintRepository.findTopKByVector(
                        vectorString,
                        k
                );

        return results.stream()

                .map(ai -> {

                    double distance =
                            ai.getDistance();

                    if (Double.isNaN(distance)
                            || Double.isInfinite(distance)) {

                        distance = 1.0;
                    }

                    double similarity =
                            (1.0 - distance) * 100;

                    Master master =
                            masterRepository.findByComplaintNo(
                                    ai.getComplaintNo()
                            );

                    if (master == null
                            || master.getId().equals(currentId)) {

                        return null;
                    }

                    return new SimilarComplaintDTO(

                            master.getId(),

                            ai.getComplaintNo(),

                            ai.getSubject(),

                            ai.getDetails(),

                            ai.getSenderName(),

                            similarity
                    );
                })

                .filter(x -> x != null)

                .collect(Collectors.toList());
    }

    // =====================================================
    // SAVE TAG
    // =====================================================

    @PostMapping("/save-tag")
    public ResponseEntity<?> saveTag(
            @RequestBody TagRequest req
    ) {

        String result =
                service.saveTag(req);

        if (result.equals("Invalid IDs")
                || result.equals("Invalid tag")) {

            return ResponseEntity
                    .badRequest()
                    .body(result);
        }

        return ResponseEntity.ok(result);
    }
}