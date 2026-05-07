package com.irvins.backend.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ai_complaints")
@Data
public class AIComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String complaintNo;
    private String subject;
    private String details;
    private String senderName;

    @JdbcTypeCode(SqlTypes.VECTOR)
    @Column(columnDefinition = "vector(384)")
    private float[] embedding;

    private double distance;

    // 👈 NEW: For similarity percentage display
    @Transient
    private double similarityScore;
    
    @Transient
    private String featureKeywords;
}