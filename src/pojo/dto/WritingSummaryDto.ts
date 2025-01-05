export interface WritingSummaryDto {
  data: string;
}

export function buildWritingSummaryDto(data: string): WritingSummaryDto {
  return {
    data: data,
  };
}