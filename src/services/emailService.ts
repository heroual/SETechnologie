import { isDemoMode } from '../lib/firebase';

interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shipping: {
    method: string;
    cost: number;
  };
  payment: {
    method: string;
    total: number;
  };
  notes?: string;
  orderDate: string;
  orderNumber: string;
}

// Function to send order confirmation email
export const sendOrderConfirmation = async (email: string, orderData: OrderData): Promise<boolean> => {
  try {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log('DEMO MODE: Sending order confirmation email to', email);
      console.log('Order data:', orderData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    }

    // In a real application, you would call your backend API to send the email
    // For example:
    // const response = await fetch('/api/send-order-confirmation', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, orderData }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to send email');
    // }
    // 
    // return true;

    // For now, we'll just simulate a successful email send
    console.log('Sending order confirmation email to', email);
    console.log('Order data:', orderData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

// Function to send contact form email
export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log('DEMO MODE: Sending contact form email');
      console.log('From:', name, email);
      console.log('Subject:', subject);
      console.log('Message:', message);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    }

    // In a real application, you would call your backend API to send the email
    // For example:
    // const response = await fetch('/api/send-contact-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, email, subject, message }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to send email');
    // }
    // 
    // return true;

    // For now, we'll just simulate a successful email send
    console.log('Sending contact form email');
    console.log('From:', name, email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
};

// Function to send quote request email
export const sendQuoteRequestEmail = async (formData: any): Promise<boolean> => {
  try {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log('DEMO MODE: Sending quote request email');
      console.log('Form data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    }

    // In a real application, you would call your backend API to send the email
    // For now, we'll just simulate a successful email send
    console.log('Sending quote request email');
    console.log('Form data:', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error sending quote request email:', error);
    return false;
  }
};