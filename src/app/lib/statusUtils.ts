/**
 * Utility to map status strings to Badge variants and format them to Title Case.
 */
export const getStatusBadgeProps = (status: string) => {
  const s = status.toLowerCase();

  // Green statuses
  const successStatuses = ['active', 'created', 'approved', 'completed', 'success'];
  // Yellow statuses
  const warningStatuses = ['inactive', 'pending', 'failed', 'in-review', 'forwarded'];

  const variant = (successStatuses.includes(s) 
    ? 'status-success' 
    : warningStatuses.includes(s) 
      ? 'status-warning' 
      : 'outline') as any;

  // Title Case conversion
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return { variant, label };
};
