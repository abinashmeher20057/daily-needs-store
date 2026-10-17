export const INITIAL_ORDERS = [
  {
    id: "DNS-98421",
    customer: {
      name: "Meher Abinash",
      phone: "+91 98765 43210",
      email: "abinash@example.com",
      address: "Flat 402, Royal Palms, Patia, Infocity Road",
      city: "Bhubaneswar",
      pincode: "751024"
    },
    items: [
      { id: "rg-1", name: "Fortune Rozana Super Basmati Rice", price: 135, quantity: 2, unit: "1 kg" },
      { id: "og-6", name: "Amul Pure Desi Ghee Tin", price: 595, quantity: 1, unit: "1 L" },
      { id: "dr-1", name: "Amul Taaza Homogenised Toned Milk Pouch", price: 27, quantity: 4, unit: "500 ml" }
    ],
    subtotal: 973,
    deliveryFee: 0,
    discount: 50,
    total: 923,
    paymentMethod: "UPI",
    deliverySlot: "Express (15 Mins)",
    status: "Out for Delivery",
    createdAt: "2026-10-16T20:25:00.000Z",
    deliveryOtp: "4829"
  },
  {
    id: "DNS-98418",
    customer: {
      name: "Pooja Sharma",
      phone: "+91 98111 22334",
      email: "pooja.sharma@example.com",
      address: "House 18, Green Valley Avenue, Jayadev Vihar",
      city: "Bhubaneswar",
      pincode: "751013"
    },
    items: [
      { id: "af-1", name: "Aashirvaad Superior MP Sharbati Atta", price: 260, quantity: 1, unit: "5 kg" },
      { id: "dp-1", name: "Tata Sampann Unpolished Toor / Arhar Dal", price: 172, quantity: 2, unit: "1 kg" },
      { id: "sm-1", name: "Tata Salt Vacuum Evaporated Iodised Salt", price: 28, quantity: 1, unit: "1 kg" }
    ],
    subtotal: 632,
    deliveryFee: 15,
    discount: 0,
    total: 647,
    paymentMethod: "Credit Card",
    deliverySlot: "Evening (6:00 PM - 8:00 PM)",
    status: "Confirmed",
    createdAt: "2026-10-16T19:40:00.000Z",
    deliveryOtp: "6318"
  },
  {
    id: "DNS-98390",
    customer: {
      name: "Rohan Varma",
      phone: "+91 97780 99887",
      email: "rohan.v@example.com",
      address: "Tower B, Apt 901, DLF Cybercity",
      city: "Bhubaneswar",
      pincode: "751024"
    },
    items: [
      { id: "br-1", name: "Maggi 2-Minute Masala Instant Noodles", price: 155, quantity: 2, unit: "840 g" },
      { id: "bs-6", name: "Cadbury Dairy Milk Silk Chocolate Bar", price: 165, quantity: 3, unit: "150 g" },
      { id: "tcb-4", name: "Nescafé Classic 100% Pure Instant Coffee", price: 330, quantity: 1, unit: "100 g Glass Jar" }
    ],
    subtotal: 1135,
    deliveryFee: 0,
    discount: 100,
    total: 1035,
    paymentMethod: "Cash on Delivery",
    deliverySlot: "Morning (7:00 AM - 9:00 AM)",
    status: "Delivered",
    createdAt: "2026-10-16T17:15:00.000Z",
    deliveryOtp: "9041"
  }
];
