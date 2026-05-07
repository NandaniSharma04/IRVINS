package com.irvins.backend.dto;

import java.util.List;
import com.irvins.backend.entity.ComplaintTag;

public class ComplaintTagResponse {

    private String senderName;
    private String complaintNo;
    private List<ComplaintTag> tags;

    public ComplaintTagResponse(String senderName, String complaintNo, List<ComplaintTag> tags) {
        this.senderName = senderName;
        this.complaintNo = complaintNo;
        this.tags = tags;
    }

    public String getSenderName() { return senderName; }
    public String getComplaintNo() { return complaintNo; }
    public List<ComplaintTag> getTags() { return tags; }
}