// src/hooks/useBusinessStoreDetails.ts

import { useCreateOrUpdateBusinessDetailsMutation } from "../services/authApi";
import { BusinessDetailsRequestDto, BusinessDetailsResponseDto } from "../types/businessStoreTypes";

export const useBusinessDetails = () => {
  const [trigger, { isLoading, error }] = useCreateOrUpdateBusinessDetailsMutation();

  /**
   * payload must conform to BusinessDetailsRequestDto
   */
  const createOrUpdate = async (
    payload: BusinessDetailsRequestDto
  ): Promise<BusinessDetailsResponseDto> => {
    const { data } = await trigger(payload).unwrap();
    return data;
  };

  return {
    createOrUpdate,
    isLoading,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (error as any)?.data?.message ?? (error as any)?.error,
  };
};
