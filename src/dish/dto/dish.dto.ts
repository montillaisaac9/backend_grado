export default class DishDto {
  id: number;
  title: string;
  description: string;
  ratingPercentage?: number;
  votesCount: number;
  photo: string | null;
}
