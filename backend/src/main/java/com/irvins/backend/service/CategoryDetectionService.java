package com.irvins.backend.service;

import com.irvins.backend.entity.ComplaintCategory;
import com.irvins.backend.repository.ComplaintCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CategoryDetectionService {
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @Autowired
    private ComplaintCategoryRepository categoryRepository;
    
    // Confidence threshold: if similarity < 0.65, mark as uncategorized
    private static final double CONFIDENCE_THRESHOLD = 0.45;
    
    /**
     * Detects complaint category using semantic similarity + keyword matching
     */
    public CategoryDetectionResult detectCategory(String subject, String details) {
        
        String combinedText = (subject + " " + details).toLowerCase();
        
        // Get all active categories
        List<ComplaintCategory> categories = categoryRepository.findAll();
        
        CategoryDetectionResult bestMatch = null;
        double bestSimilarity = 0;
        
        for (ComplaintCategory category : categories) {
            
            if (!category.isActive()) continue;
            
            // 1️⃣ CHECK KEYWORDS FIRST (Faster, high priority)
            boolean keywordMatch = checkKeywordMatch(combinedText, category.getKeywords());
            
            // 2️⃣ USE EMBEDDINGS FOR SEMANTIC SIMILARITY (AI-powered)
            float[] complaintEmbedding = embeddingService.getEmbedding(combinedText);
            float[] categoryEmbedding = embeddingService.getEmbedding(
                category.getCategoryEmbeddingText()
            );
            
            double similarity = cosineSimilarity(complaintEmbedding, categoryEmbedding);
            
            // Boost score if keywords match
            if (keywordMatch) {
                similarity = Math.min(similarity + 0.15, 1.0);  // Max 1.0
            }
            
            // Track best match
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                
                // Detect best subcategory within main category
                String detectedSubcategory = detectSubcategory(
                    combinedText, 
                    category.getSubcategories()
                );
                
                bestMatch = new CategoryDetectionResult(
                    category.getMainCategory(),
                    detectedSubcategory,
                    bestSimilarity,
                    category.getPriority()
                );
            }
        }
        
        // If no match above threshold, return uncategorized
        if (bestSimilarity < CONFIDENCE_THRESHOLD) {
            return new CategoryDetectionResult(
                "Uncategorized",
                "Other",
                bestSimilarity,
                1
            );
        }
        
        return bestMatch;
    }
    
    /**
     * Check if any keywords from the category match the complaint text
     */
    private boolean checkKeywordMatch(String text, List<String> keywords) {
        if (keywords == null || keywords.isEmpty()) return false;
        
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Detect best subcategory based on keywords
     */
    private String detectSubcategory(String text, List<String> subcategories) {
        if (subcategories == null || subcategories.isEmpty()) {
            return "General";
        }
        
        // For simplicity, return first subcategory
        // Can be enhanced with keyword-based detection per subcategory
        return subcategories.get(0);
    }
    
    /**
     * Calculate cosine similarity between two embeddings
     */
    private double cosineSimilarity(float[] embedding1, float[] embedding2) {
        if (embedding1.length != embedding2.length) {
            return 0;
        }
        
        double dotProduct = 0;
        double norm1 = 0;
        double norm2 = 0;
        
        for (int i = 0; i < embedding1.length; i++) {
            dotProduct += embedding1[i] * embedding2[i];
            norm1 += embedding1[i] * embedding1[i];
            norm2 += embedding2[i] * embedding2[i];
        }
        
        double denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
        
        if (denominator == 0) return 0;
        
        return dotProduct / denominator;
    }
    
    // ============= RESULT CLASS =============
    public static class CategoryDetectionResult {
        public String mainCategory;
        public String subcategory;
        public double confidence;
        public Integer priority;
        
        public CategoryDetectionResult(String mainCategory, String subcategory, 
                                      double confidence, Integer priority) {
            this.mainCategory = mainCategory;
            this.subcategory = subcategory;
            this.confidence = confidence;
            this.priority = priority;
        }
    }
}