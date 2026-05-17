package com.irvins.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatsDTO {
    
    private Long totalComplaints;
    private Long totalZones;
    private Long totalDivisions;
    private List<MainCategoryStats> categories;
    private Long uncategorized;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MainCategoryStats {
        private String mainCategory;
        private Long count;
        private Double percentage;
        private Integer priority;  // For Women Safety (priority = 2)
        private List<SubcategoryStats> subcategories;
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class SubcategoryStats {
            private String subcategoryName;
            private Long count;
            private Double percentage;
        }
    }
}