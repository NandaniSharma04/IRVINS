package com.irvins.backend.service;

import com.irvins.backend.dto.TagRequest;
import com.irvins.backend.entity.ComplaintTag;
import com.irvins.backend.entity.SimilarityTag;
import com.irvins.backend.repository.ComplaintTagRepository;
import com.irvins.backend.repository.MasterRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class ComplaintTagService {

    @Autowired
    private ComplaintTagRepository repository;

    @Autowired
    private MasterRepository masterRepository;

    public String saveTag(TagRequest req) {

    // ✅ NULL CHECK FIRST (VERY IMPORTANT)
    if (req.getSourceComplaintId() == null || req.getTargetComplaintId() == null) {
        return "Invalid IDs";
    }

    // ✅ check IDs exist in DB
    Long sourceId = req.getSourceComplaintId();
    Long targetId = req.getTargetComplaintId();
    if (sourceId == null || targetId == null || 
        !masterRepository.existsById(sourceId) ||
        !masterRepository.existsById(targetId)) {
        return "Invalid IDs";
    }

    // ✅ safe enum conversion
    SimilarityTag tagEnum;
    try {
        tagEnum = SimilarityTag.valueOf(req.getSimilarityTag());
    } catch (Exception e) {
        return "Invalid tag";
    }

    Optional<ComplaintTag> existing =
        repository.findBySourceComplaintIdAndTargetComplaintId(
            req.getSourceComplaintId(),
            req.getTargetComplaintId()
        );

    ComplaintTag tag = existing.orElse(new ComplaintTag());

    tag.setSourceComplaintId(req.getSourceComplaintId());
    tag.setTargetComplaintId(req.getTargetComplaintId());
    tag.setSimilarityPercent(req.getSimilarityPercent());
    tag.setSimilarityTag(tagEnum);

    repository.save(tag);

    return "Saved";
}
    public List<ComplaintTag> getTagsByComplaintId(Long complaintId) {
            return repository.findBySourceComplaintIdOrTargetComplaintId(complaintId,complaintId);
        }
}