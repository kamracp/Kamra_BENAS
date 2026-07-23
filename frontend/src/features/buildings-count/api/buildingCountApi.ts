import client from "../../../services/api/client";

interface BuildingListItem {
  id: number;
}

export const buildingCountApi = {
  async getCount(): Promise<number> {
    const { data } = await client.get<BuildingListItem[]>("/buildings/");
    return data.length;
  },
};
