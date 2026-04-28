export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  studentId: string;
  tenantId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

/**
 * Mock implementation of Wave/Orange Money payment API
 */
export async function processMobilePayment(request: PaymentRequest): Promise<PaymentResponse> {
  console.log(`Processing mobile payment for student ${request.studentId} at university ${request.tenantId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 90% success rate for simulation
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: "Paiement effectué avec succès via Wave."
    };
  } else {
    return {
      success: false,
      message: "Le paiement a échoué. Veuillez vérifier votre solde ou réessayer."
    };
  }
}
