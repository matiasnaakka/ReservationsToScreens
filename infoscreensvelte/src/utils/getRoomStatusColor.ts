export const getRoomStatusColor = (status?: string) => {
  switch (status) {
    case 'occupied':
      return 0xff3333; // Red
    case 'reserved':
      return 0xffa500; // Orange
    case 'free':
      return 0x33ff33; // Green
    case 'pending':
      return 0xffff00;
    default:
      return 0x808080; // Gray
  }
};
