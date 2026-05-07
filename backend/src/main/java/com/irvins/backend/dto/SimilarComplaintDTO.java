package com.irvins.backend.dto;


import lombok.Data;

@Data
public class SimilarComplaintDTO {
    private String complaintNo;
    private String subject;
    private String details;
    private String senderName;
    private double similarity;
    private Long masterId;

    public SimilarComplaintDTO(Long masterId,
        String complaintNo, String subject,
                               String details, String senderName,
                               double similarity) {
        this.masterId = masterId;
        this.complaintNo = complaintNo;
        this.subject = subject;
        this.details = details;
        this.senderName = senderName;
        this.similarity = similarity;
    }
}
// package com.irvins.backend.dto;

// import lombok.Data;
// import lombok.NoArgsConstructor;
// import lombok.AllArgsConstructor;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class SimilarComplaintDTO {
//     private String complaintNo;
//     private String subject;
//     private String details;
//     private String senderName;
//     private double similarity;
// }