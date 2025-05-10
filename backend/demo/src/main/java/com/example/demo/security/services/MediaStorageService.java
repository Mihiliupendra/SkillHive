package com.example.demo.security.services;

import com.example.demo.model.MediaType;
import com.example.demo.model.Post.Media;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class MediaStorageService {

    private static final String SUPABASE_URL = "https://uslflvhpalfpqxmxnazj.supabase.co";
    private static final String SUPABASE_BUCKET = "media";
    private static final String API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbGZsdmhwYWxmcHF4bXhuYXpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc3NTg5NiwiZXhwIjoyMDYwMzUxODk2fQ.nHl1jTV8ArpjEaHkZnjoynxQaazb62krBrEgLb3iapk";

    public List<Media> uploadMedia(List<MultipartFile> files) throws IOException {
        List<Media> uploaded = new ArrayList<>();
        OkHttpClient client = new OkHttpClient();

        for (MultipartFile file : files) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            RequestBody fileBody = RequestBody.create(file.getBytes());
            Request request = new Request.Builder()
                    .url(SUPABASE_URL + "/storage/v1/object/" + SUPABASE_BUCKET + "/" + fileName)
                    .addHeader("apikey", API_KEY)
                    .addHeader("Authorization", "Bearer " + API_KEY)
                    .addHeader("Content-Type", file.getContentType())
                    .put(fileBody)
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                throw new IOException("Upload failed: " + response.message());
            }

            Media media = new Media();
            media.setUrl(SUPABASE_URL + "/storage/v1/object/public/" + SUPABASE_BUCKET + "/" + fileName);
            media.setPublicId(fileName);
            media.setType(file.getContentType().startsWith("video") ? MediaType.VIDEO : MediaType.IMAGE);
            media.setCaption("");
            media.setDuration(null);

            uploaded.add(media);
        }

        return uploaded;
    }

    public void deleteMediaFromSupabase(String fileName) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/storage/v1/object/" + SUPABASE_BUCKET + "/" + fileName)
                .delete()
                .addHeader("apikey", API_KEY)
                .addHeader("Authorization", "Bearer " + API_KEY)
                .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            throw new IOException("Failed to delete media from Supabase: " + response.message());
        }
    }

}
