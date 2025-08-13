export type ContactChannel = 'sms' | 'email';

export type ApprovalMessage = {
  caseId: string;
  patientId: string;
  scheduledAtIso: string;
  recipient: string;
  channel: ContactChannel;
};

export type ReminderMessage = {
  caseId: string;
  recipient: string;
  channel: ContactChannel;
  remindAtIso: string;
};

export type ProviderResponse = {
  id: string;
  accepted: boolean;
  throttled: boolean;
};

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface NotificationProvider {
  sendApproval(input: ApprovalMessage): Promise<ProviderResponse>;
  sendReminder(input: ReminderMessage): Promise<ProviderResponse>;
}

/**
 * Mock provider that never calls a real service. Always resolves immediately
 * and marks responses as accepted. This is designed to be rate-limit safe.
 */
export const MockNotificationProvider: NotificationProvider = {
  async sendApproval(input) {
    void input;
    return {
      id: generateId('appr'),
      accepted: true,
      throttled: false,
    };
  },
  async sendReminder(input) {
    void input;
    return {
      id: generateId('rem'),
      accepted: true,
      throttled: false,
    };
  },
};

// e‑Nabız / MEDULA mock feedback interface and provider
export type ExternalFeedback = {
  system: 'e-nabiz' | 'medula';
  code: string;
  message: string;
  correlationId?: string;
};

export interface ExternalFeedbackProvider {
  submit(payload: Record<string, unknown>): Promise<ExternalFeedback>;
}

export const MockExternalFeedbackProvider: ExternalFeedbackProvider = {
  async submit(payload) {
    void payload;
    return {
      system: 'e-nabiz',
      code: 'OK',
      message: 'Mock feedback accepted',
      correlationId: generateId('fb'),
    };
  },
};


