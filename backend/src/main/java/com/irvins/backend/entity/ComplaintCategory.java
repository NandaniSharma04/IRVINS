package com.irvins.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "complaint_categories")
@Data
@NoArgsConstructor
public class ComplaintCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String mainCategory;  // e.g., "Staff Misconduct"
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @Column(name = "subcategory")
    private List<String> subcategories;  // e.g., ["Abuse", "Bribery", "Harassment"]
    
    @ElementCollection
    @Column(name = "keyword")
    private List<String> keywords;  // e.g., ["abuse", "rude", "harassment", "assault"]
    
    @Column(columnDefinition = "TEXT")
    private String categoryEmbeddingText;  // Combined text for similarity matching
    
    private Integer priority = 1;  // For women safety issues (2), regular = 1
    
    private boolean active = true;
}
