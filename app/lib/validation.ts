export interface OrderInput {
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
}

const MIN_BUDGET = 5;
const MAX_BUDGET = 10000;

export function isValidBudget(budget: unknown): budget is number {
  return (
    typeof budget === "number" &&
    Number.isFinite(budget) &&
    budget >= MIN_BUDGET &&
    budget <= MAX_BUDGET
  );
}

export function isValidTitle(title: unknown): boolean {
  return (
    typeof title === "string" &&
    title.trim().length >= 5 &&
    title.trim().length <= 120
  );
}

export function isValidDeadline(deadline: unknown): boolean {
  if (typeof deadline !== "string") return false;
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return false;
  // must be after today
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() > today.getTime();
}

export function validateOrder(input: OrderInput): boolean {
  return (
    isValidTitle(input.title) &&
    typeof input.description === "string" &&
    input.description.trim().length >= 20 &&
    isValidBudget(input.budget) &&
    isValidDeadline(input.deadline)
  );
}