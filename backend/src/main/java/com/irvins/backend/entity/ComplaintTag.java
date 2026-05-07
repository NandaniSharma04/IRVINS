package com.irvins.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "complaint_tags",
       uniqueConstraints = @UniqueConstraint(columnNames = {"source_complaint_id", "target_complaint_id"}))
public class ComplaintTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_complaint_id")
    private Long sourceComplaintId;

    @Column(name = "target_complaint_id")
    private Long targetComplaintId;

    private Double similarityPercent;

    @Enumerated(EnumType.STRING)
    private SimilarityTag similarityTag;

    // ✅ GETTERS
    public Long getId() { return id; }

    public Long getSourceComplaintId() { return sourceComplaintId; }

    public Long getTargetComplaintId() { return targetComplaintId; }

    public Double getSimilarityPercent() { return similarityPercent; }

    public SimilarityTag getSimilarityTag() { return similarityTag; }

    // ✅ SETTERS
    public void setId(Long id) { this.id = id; }

    public void setSourceComplaintId(Long sourceComplaintId) {
        this.sourceComplaintId = sourceComplaintId;
    }

    public void setTargetComplaintId(Long targetComplaintId) {
        this.targetComplaintId = targetComplaintId;
    }

    public void setSimilarityPercent(Double similarityPercent) {
        this.similarityPercent = similarityPercent;
    }

    public void setSimilarityTag(SimilarityTag similarityTag) {
        this.similarityTag = similarityTag;
    }
}