export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateBudget(budget: number): string | null {
  if (isNaN(budget)) return "Budget must be a number";
  if (budget < 1) return "Budget must be at least 1";
  return null;
}

export function validateDeadline(deadline: string): string | null {
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return "Invalid deadline";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "Deadline cannot be in the past";
  return null;
}

export function validateOrderFields(fields: {
  title: string;
  description: string;
  budget: number;
  deadline: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!fields.title || fields.title.trim().length < 3) {
    errors.push("Title is too short");
  }
  if (!fields.description || fields.description.trim().length === 0) {
    errors.push("Description is required");
  }

  const budgetError = validateBudget(fields.budget);
  if (budgetError) errors.push(budgetError);

  const deadlineError = validateDeadline(fields.deadline);
  if (deadlineError) errors.push(deadlineError);

  return { valid: errors.length === 0, errors };
}