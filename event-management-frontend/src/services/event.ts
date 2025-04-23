import api from "./api";
import { AxiosResponse } from "axios";
import {
  mockUpcomingEvents,
  mockAllEvents,
  mockSearchEvents,
  mockGetEventById,
} from "./mockData";

export interface EventImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  registrationCount: number;
  isFull: boolean;
  images: EventImage[];
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Flag to track if we should use mock data (will be set to true if API calls fail)
let useMockData = false;

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  // Set the flag to use mock data for future calls
  useMockData = true;
  return true; // Error occurred
};

export const getUpcomingEvents = async (
  page = 0,
  size = 6,
  sortBy = "startTime",
  direction = "asc"
): Promise<PagedResponse<Event>> => {
  // If we've had API failures before, use mock data directly
  if (useMockData) {
    return mockUpcomingEvents(page, size);
  }

  try {
    const response: AxiosResponse<PagedResponse<Event>> = await api.get(
      "/events/upcoming",
      {
        params: {
          page,
          size,
          sortBy,
          direction,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return mockUpcomingEvents(page, size);
  }
};

export const getAllEvents = async (
  page = 0,
  size = 6,
  sortBy = "startTime",
  direction = "asc"
): Promise<PagedResponse<Event>> => {
  // If we've had API failures before, use mock data directly
  if (useMockData) {
    return mockAllEvents(page, size);
  }

  try {
    const response: AxiosResponse<PagedResponse<Event>> = await api.get(
      "/events",
      {
        params: {
          page,
          size,
          sortBy,
          direction,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return mockAllEvents(page, size);
  }
};

export const getEventById = async (id: number): Promise<Event> => {
  // If we've had API failures before, use mock data directly
  if (useMockData) {
    const event = mockGetEventById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  try {
    const response: AxiosResponse<Event> = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    const event = mockGetEventById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }
};

export const searchEvents = async (
  keyword: string,
  page = 0,
  size = 6
): Promise<PagedResponse<Event>> => {
  // If we've had API failures before, use mock data directly
  if (useMockData) {
    return mockSearchEvents(keyword, page, size);
  }

  try {
    const response: AxiosResponse<PagedResponse<Event>> = await api.get(
      "/events/search",
      {
        params: {
          keyword,
          page,
          size,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return mockSearchEvents(keyword, page, size);
  }
};

// Interface for Unsplash keyword image generation
export interface KeywordImageRequest {
  keyword: string;
  count?: number;
}

/**
 * Generate event images using Unsplash based on a keyword
 * @param eventId The ID of the event to generate images for
 * @param keywordRequest The keyword and optional count (default 4)
 * @returns Array of generated image DTOs
 */
export const generateImagesFromKeyword = async (
  eventId: number,
  keywordRequest: KeywordImageRequest
): Promise<ImageDTO[]> => {
  try {
    const response: AxiosResponse<ImageDTO[]> = await api.post(
      `/events/${eventId}/images/generate`,
      keywordRequest
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
