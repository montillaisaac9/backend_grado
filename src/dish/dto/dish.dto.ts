export default class DishDto {
  id: number;
  title: string;
  description: string;
  ratingPercentage?: number;
  votesCount: number;
  photo: string | null;
  cost: number;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
}
