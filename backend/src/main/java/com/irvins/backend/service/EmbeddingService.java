package com.irvins.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private final String aiServiceUrl = "http://localhost:8000/embed";

    @SuppressWarnings("unchecked")
    public float[] getEmbedding(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or empty");
        }

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = Map.of("text", text);

        try {
            Map<String, Object> response =
                (Map<String, Object>) restTemplate.postForObject(
                    aiServiceUrl,
                    request,
                    Map.class);

            if (response == null || response.get("embedding") == null) {
                throw new RuntimeException("Failed to get embedding from AI service");
            }

            List<?> embeddingList = (List<?>) response.get("embedding");

            double[] doubles = embeddingList.stream()
                    .mapToDouble(val -> ((Number) val).doubleValue())
                    .toArray();

            float[] floats = new float[doubles.length];
            for (int i = 0; i < doubles.length; i++) {
                floats[i] = (float) doubles[i];
            }

            return floats;

        } catch (HttpClientErrorException ex) {
            throw new RuntimeException("AI service returned HTTP error: " + ex.getStatusCode(), ex);
        } catch (ResourceAccessException ex) {
            throw new RuntimeException("Failed to connect to AI service at " + aiServiceUrl, ex);
        } catch (Exception ex) {
            throw new RuntimeException("Error processing embedding response", ex);
        }
    }
}
