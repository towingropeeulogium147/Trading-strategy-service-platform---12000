declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectMetaMask = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    return accounts[0];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

export const checkMetaMaskConnection = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const sendPayment = async (walletAddress: string, amount: string) => {
  const PAYMENT_WALLET = '0xd4062e68022ef5235898CBc4f069A0df4fF2Ea6C';

  const transactionParameters = {
    to: PAYMENT_WALLET,
    from: walletAddress,
    value: amount,
  };

  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  return txHash;
};

export const checkSubscription = () => {
  const subscription = localStorage.getItem('subscription');
  if (!subscription) return null;

  const sub = JSON.parse(subscription);
  const endDate = new Date(sub.endDate);
  const now = new Date();

  if (now > endDate) {
    return { ...sub, active: false, expired: true };
  }

  return sub;
};

export const isSubscriptionActive = () => {
  const sub = checkSubscription();
  return sub && sub.active && !sub.expired;
};
