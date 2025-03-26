package com.example.event_management_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class EventManagementApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventManagementApiApplication.class, args);
	}

}
// changed git config email to match github account
