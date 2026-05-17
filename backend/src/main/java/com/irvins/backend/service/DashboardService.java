package com.irvins.backend.service;

import com.irvins.backend.dto.CategoryStatsDTO;
import com.irvins.backend.dto.CategoryStatsDTO.MainCategoryStats;
import com.irvins.backend.dto.CategoryStatsDTO.MainCategoryStats.SubcategoryStats;
import com.irvins.backend.entity.Master;
import com.irvins.backend.repository.MasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private MasterRepository masterRepository;
    
    /**
     * Get category statistics for dashboard
     */
    public CategoryStatsDTO getCategoryStats() {
        
        List<Master> allComplaints = masterRepository.findAll();
        Long totalComplaints = (long) allComplaints.size();
        
        // Count unique zones & divisions
        Long totalZones = allComplaints.stream()
            .map(Master::getZone)
            .distinct()
            .count();
        
        Long totalDivisions = allComplaints.stream()
            .map(Master::getDivision)
            .distinct()
            .count();
        
        // Group by main category
        Map<String, List<Master>> categorizedComplaints = allComplaints.stream()
            .filter(c -> c.getMainCategory() != null)
            .collect(Collectors.groupingBy(Master::getMainCategory));
        
        // Count uncategorized
        Long uncategorized = allComplaints.stream()
            .filter(c -> c.getMainCategory() == null || c.getMainCategory().equals("Uncategorized"))
            .count();
        
        // Build statistics
        List<MainCategoryStats> categoryStats = categorizedComplaints.entrySet().stream()
            .map(entry -> {
                String mainCategory = entry.getKey();
                List<Master> complaints = entry.getValue();
                Long count = (long) complaints.size();
                Double percentage = (count.doubleValue() / totalComplaints) * 100;
                
                // Get priority from first complaint in category
                Integer priority = complaints.get(0).getAutoCategorized() ? 1 : 1;
                if ("Women Safety Issues".equals(mainCategory)) {
                    priority = 2;  // Higher priority
                }
                
                // Group subcategories
                Map<String, List<Master>> subcategorized = complaints.stream()
                    .filter(c -> c.getSubcategory() != null)
                    .collect(Collectors.groupingBy(Master::getSubcategory));
                
                List<SubcategoryStats> subcategoryStats = subcategorized.entrySet().stream()
                    .map(subEntry -> new SubcategoryStats(
                        subEntry.getKey(),
                        (long) subEntry.getValue().size(),
                        (subEntry.getValue().size() / (double) complaints.size()) * 100
                    ))
                    .sorted(Comparator.comparingLong(SubcategoryStats::getCount).reversed())
                    .collect(Collectors.toList());
                
                return new MainCategoryStats(
                    mainCategory,
                    count,
                    percentage,
                    priority,
                    subcategoryStats
                );
            })
            .sorted(Comparator.comparingLong(MainCategoryStats::getCount).reversed())
            .collect(Collectors.toList());
        
        return new CategoryStatsDTO(
            totalComplaints,
            totalZones,
            totalDivisions,
            categoryStats,
            uncategorized
        );
    }
}