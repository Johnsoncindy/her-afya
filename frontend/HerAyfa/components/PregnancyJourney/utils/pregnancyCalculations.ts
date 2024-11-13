import { differenceInWeeks, addWeeks } from 'date-fns';

export const getCurrentWeek = (lastPeriodDate: Date): number => {
  const weeks = differenceInWeeks(new Date(), new Date(lastPeriodDate));
  return Math.min(40, Math.max(1, weeks));
};

export const getTrimesters = (currentWeek: number) => {
  let trimester = 1;
  let weekInTrimester = currentWeek;

  if (currentWeek > 27) {
    trimester = 3;
    weekInTrimester = currentWeek - 27;
  } else if (currentWeek > 13) {
    trimester = 2;
    weekInTrimester = currentWeek - 13;
  }

  return { trimester, weekInTrimester };
};

export const calculateDueDate = (lastPeriodDate: Date): Date => {
  return addWeeks(new Date(lastPeriodDate), 40);
};

export const getBabySizeComparison = (week: number) => {
    const comparisons: { [key: number]: { fruit: string; length: string; weight: string } } = {
      1: { fruit: 'Poppy seed', length: '0.1 mm', weight: '<0.1 g' },
      2: { fruit: 'Sesame seed', length: '0.2 mm', weight: '<0.1 g' },
      3: { fruit: 'Quinoa grain', length: '0.4 mm', weight: '<0.1 g' },
      4: { fruit: 'Poppyseed muffin', length: '1 mm', weight: '<0.1 g' },
      5: { fruit: 'Apple seed', length: '2 mm', weight: '0.1 g' },
      6: { fruit: 'Sweet pea', length: '4-7 mm', weight: '0.3 g' },
      7: { fruit: 'Blueberry', length: '13 mm', weight: '0.9 g' },
      8: { fruit: 'Raspberry', length: '16 mm', weight: '1 g' },
      9: { fruit: 'Green olive', length: '23 mm', weight: '2 g' },
      10: { fruit: 'Prune', length: '31 mm', weight: '4 g' },
      11: { fruit: 'Fig', length: '41 mm', weight: '7 g' },
      12: { fruit: 'Lime', length: '5.4 cm', weight: '14 g' },
      13: { fruit: 'Lemon', length: '7.4 cm', weight: '23 g' },
      14: { fruit: 'Orange', length: '8.7 cm', weight: '43 g' },
      15: { fruit: 'Apple', length: '10.1 cm', weight: '70 g' },
      16: { fruit: 'Avocado', length: '11.6 cm', weight: '100 g' },
      17: { fruit: 'Pear', length: '13 cm', weight: '140 g' },
      18: { fruit: 'Bell pepper', length: '14.2 cm', weight: '190 g' },
      19: { fruit: 'Mango', length: '15.3 cm', weight: '240 g' },
      20: { fruit: 'Banana', length: '16.4 cm', weight: '300 g' },
      21: { fruit: 'Pomegranate', length: '26.7 cm', weight: '360 g' },
      22: { fruit: 'Papaya', length: '27.8 cm', weight: '430 g' },
      23: { fruit: 'Grapefruit', length: '28.9 cm', weight: '500 g' },
      24: { fruit: 'Cantaloupe', length: '30 cm', weight: '600 g' },
      25: { fruit: 'Cauliflower', length: '34.6 cm', weight: '660 g' },
      26: { fruit: 'Lettuce head', length: '35.6 cm', weight: '760 g' },
      27: { fruit: 'Rutabaga', length: '36.6 cm', weight: '875 g' },
      28: { fruit: 'Eggplant', length: '37.6 cm', weight: '1 kg' },
      29: { fruit: 'Butternut squash', length: '38.6 cm', weight: '1.15 kg' },
      30: { fruit: 'Cabbage', length: '39.9 cm', weight: '1.3 kg' },
      31: { fruit: 'Coconut', length: '41.1 cm', weight: '1.5 kg' },
      32: { fruit: 'Jicama', length: '42.4 cm', weight: '1.7 kg' },
      33: { fruit: 'Pineapple', length: '43.7 cm', weight: '1.9 kg' },
      34: { fruit: 'Cantaloupe', length: '45 cm', weight: '2.1 kg' },
      35: { fruit: 'Honeydew melon', length: '46.2 cm', weight: '2.4 kg' },
      36: { fruit: 'Large romaine lettuce', length: '47.4 cm', weight: '2.6 kg' },
      37: { fruit: 'Winter melon', length: '48.6 cm', weight: '2.9 kg' },
      38: { fruit: 'Watermelon', length: '49.8 cm', weight: '3.1 kg' },
      39: { fruit: 'Mini pumpkin', length: '50.7 cm', weight: '3.3 kg' },
      40: { fruit: 'Small pumpkin', length: '51-53 cm', weight: '3.4 kg' },
    };
  
    return comparisons[week] || comparisons[40];
  };