export const finesData = [
  { 
    id: '#8435', 
    offender: 'Jim Halpert',
    licensePlate: 'N 555 WR',
    violation: 'Speeding', 
    description: 'Driving 85 km/h in a 60 km/h zone.',
    amount: 750.00, 
    date: '2024-07-30', 
    dueDate: '2024-08-30',
    status: 'Disputed',
    location: 'Independence Avenue, Windhoek',
    officer: 'Sgt. A. Shipanga',
    officerBadge: 'TP54321',
    disputeReason: 'The speed limit sign was obscured by a tree branch. I have photographic evidence showing the obstructed sign. I was driving at what I believed to be the correct speed limit for that area.',
    disputeEvidence: [
        { name: 'obstructed_sign.jpg', url: '/placeholder.svg' },
        { name: 'dashboard_cam_footage.mp4', url: '#' }
    ]
  },
  { 
    id: '#8433', 
    offender: 'Michael Scott',
    licensePlate: 'N 123 WHK',
    violation: 'Illegal U-Turn', 
    description: 'Made an illegal U-turn at a non-designated spot.',
    amount: 400.00, 
    date: '2024-07-28', 
    dueDate: '2024-08-28',
    status: 'Outstanding',
    location: 'Sam Nujoma Drive, Windhoek',
    officer: 'Sgt. A. Shipanga',
    officerBadge: 'TP54321'
  },
  { 
    id: '#8430', 
    offender: 'John Doe',
    licensePlate: 'N 456 C',
    violation: 'Speeding', 
    description: 'Driving 100 km/h in an 80 km/h zone.',
    amount: 900.00, 
    date: '2024-07-15', 
    dueDate: '2024-08-15',
    status: 'Overdue',
    location: 'Western Bypass, Windhoek',
    officer: 'Insp. M. Kavari',
    officerBadge: 'TP12345'
  },
  { 
    id: '#8421', 
    offender: 'Jane Smith',
    licensePlate: 'N 789 S',
    violation: 'Illegal Parking', 
    description: 'Parked in a loading zone for over 30 minutes.',
    amount: 250.00, 
    date: '2024-07-10', 
    dueDate: '2024-08-10',
    status: 'Paid',
    paymentDate: '2024-07-12',
    location: 'Post St Mall, Windhoek',
    officer: 'Sgt. A. Shipanga',
    officerBadge: 'TP54321'
  },
  { 
    id: '#8415', 
    offender: 'Peter Jones',
    licensePlate: 'N 987 G',
    violation: 'Running a red light', 
    description: 'Failed to stop at a red traffic signal.',
    amount: 1000.00, 
    date: '2024-07-05', 
    dueDate: '2024-08-05',
    status: 'Paid',
    paymentDate: '2024-07-06',
    location: 'Robert Mugabe Ave & Laurent-Désiré Kabila St intersection',
    officer: 'Insp. M. Kavari',
    officerBadge: 'TP12345'
  },
  {
    id: '#8420',
    offender: 'Andy Bernard',
    licensePlate: 'N 222 COR',
    violation: 'Illegal Parking',
    description: 'Parked in a commercial loading zone.',
    amount: 250.00,
    date: '2024-07-29',
    dueDate: '2024-08-29',
    status: 'Disputed',
    location: 'Nelson Mandela Avenue',
    officer: 'Sgt. A. Shipanga',
    officerBadge: 'TP54321',
    disputeReason: 'I was actively unloading equipment for my a cappella group performance. The sign allows for 15 minutes of loading, and I was there for less than 10. My bandmates can corroborate.',
    disputeEvidence: [
        { name: 'unloading_photo.jpg', url: '/placeholder.svg' }
    ]
  },
  {
    id: '#8411',
    offender: 'Stanley Hudson',
    licensePlate: 'N 333 SUD',
    violation: 'Running a red light',
    description: 'Failed to stop at a red traffic signal.',
    amount: 1000.00,
    date: '2024-07-28',
    dueDate: '2024-08-28',
    status: 'Disputed',
    location: 'Robert Mugabe Ave & Laurent-Désiré Kabila St intersection',
    officer: 'Insp. M. Kavari',
    officerBadge: 'TP12345',
    disputeReason: 'It was pretzel day. I was distracted. However, the light was yellow when I entered the intersection, not red. The traffic camera timing must be incorrect.',
    disputeEvidence: []
  },
  {
    id: '#8401',
    offender: 'Phyllis Vance',
    licensePlate: 'N 444 VAN',
    violation: 'Failure to signal',
    description: 'Changed lanes without signaling.',
    amount: 200.00,
    date: '2024-07-27',
    dueDate: '2024-08-27',
    status: 'Disputed',
    location: 'Hosea Kutako Drive',
    officer: 'Sgt. A. Shipanga',
    officerBadge: 'TP54321',
    disputeReason: 'My turn signal is faulty. I have a receipt from the mechanic dated the day after the incident showing that I had it repaired. This was a mechanical failure, not negligence.',
    disputeEvidence: [
        { name: 'mechanic_receipt.pdf', url: '#' }
    ]
  }
];

export const myFinesData = finesData;