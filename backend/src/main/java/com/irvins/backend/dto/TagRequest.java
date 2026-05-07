package com.irvins.backend.dto;

public class TagRequest {

    private Long sourceComplaintId;
    private Long targetComplaintId;
    private Double similarityPercent;
    private String similarityTag;

    // ✅ GETTERS
    public Long getSourceComplaintId() {
        return sourceComplaintId;
    }

    public Long getTargetComplaintId() {
        return targetComplaintId;
    }

    public Double getSimilarityPercent() {
        return similarityPercent;
    }

    public String getSimilarityTag() {
        return similarityTag;
    }

    // ✅ SETTERS
    public void setSourceComplaintId(Long sourceComplaintId) {
        this.sourceComplaintId = sourceComplaintId;
    }

    public void setTargetComplaintId(Long targetComplaintId) {
        this.targetComplaintId = targetComplaintId;
    }

    public void setSimilarityPercent(Double similarityPercent) {
        this.similarityPercent = similarityPercent;
    }

    public void setSimilarityTag(String similarityTag) {
        this.similarityTag = similarityTag;
    }
}