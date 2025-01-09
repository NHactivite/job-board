declare module "@cashfreepayments/cashfree-js" {
    export function load(config: { mode: string }): Promise<any>;
    export interface PaymentSession {
      paymentSessionId: string;
      orderId: string;
      orderStatus: string;
    }
    export function redirectToPayment(options: { session: string }): Promise<void>;
  }
  