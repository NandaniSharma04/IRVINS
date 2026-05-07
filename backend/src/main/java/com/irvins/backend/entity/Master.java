package com.irvins.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;


@Entity
@Table(name = "Master")
@Data
public class Master {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String complaintNo;
    
    @Column(nullable = false)
    private String senderName;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;
    
    @Column(nullable = false)
    private String zone;
    
    @Column(nullable = false)
    private String division;

    private String serviceId;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
