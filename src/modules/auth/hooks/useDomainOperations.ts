// src/hooks/useDomain.ts
import {
  useLazyListDomainsQuery,
  useCreateOrUpdateDomainMutation,
} from "../services/sellerApi";
import { DomainRequestDto, DomainResponseDto } from "../types/domainTypes";

export function useDomain() {
  const [triggerList] = useLazyListDomainsQuery();
  const [saveDomainMutation] = useCreateOrUpdateDomainMutation();

  /** returns “available” or “taken” */
  const checkDomainAvailability = async (
    slug: string
  ): Promise<"available" | "taken"> => {
    const domainUrl = `${slug.trim().toLowerCase()}`;
    const res = await triggerList({
      search: slug,
      // page: 1,
      // limit: 10,
    }).unwrap();
    const taken = res.data.some((d) => d.domain === domainUrl);
    return taken ? "taken" : "available";
  };

  /** returns the created/updated DomainResponseDto */
  const saveDomain = async (
    dto: DomainRequestDto
  ): Promise<DomainResponseDto> => await saveDomainMutation(dto).unwrap();

  return { checkDomainAvailability, saveDomain };
}
