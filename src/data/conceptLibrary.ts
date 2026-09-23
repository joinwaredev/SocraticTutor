import { GradeLevel, ScaffoldType } from '../types';

export interface MathConcept {
  id: string;
  title: string;
  grade: '3rd' | '4th' | '5th';
  category:
    | 'Fractions & Decimals'
    | 'Multiplication & Division'
    | 'Geometry & Measurement'
    | 'Number Sense & Mental Math'
    | 'Algebraic & Spatial Thinking';
  oneLiner: string;
  metaphor: {
    title: string;
    story: string;
  };
  whyItWorks: string;
  proTip: string;
  encouragement: string;
  interactiveType:
    | 'fraction_bars'
    | 'array_grid'
    | 'partial_products'
    | 'clock_fractions'
    | 'area_vs_perimeter'
    | 'number_line_jumps'
    | 'volume_layers'
    | 'powers_of_ten'
    | 'coordinate_plane'
    | 'constant_difference'
    | 'multiplicative_comparison'
    | 'decimal_hundredths';
  interactiveData: any;
  practicePrompt: {
    problemText: string;
    scaffoldType: ScaffoldType;
    scaffoldData: any;
  };
  tags: string[];
}

export const MATH_CONCEPTS: MathConcept[] = [
  // ==========================================
  // GRADE 3 CONCEPTS
  // ==========================================
  {
    id: 'g3-fractions-fair-shares',
    title: 'Fractions as Fair Shares & Equal Parts',
    grade: '3rd',
    category: 'Fractions & Decimals',
    oneLiner: 'A fraction describes equal slices of one whole object or group.',
    metaphor: {
      title: '🍕 The Pizza Party Rule',
      story: 'Imagine ordering a personal pizza. The bottom number (Denominator) counts how many equal slices the chef cut. The top number (Numerator) counts how many slices are on your plate!',
    },
    whyItWorks: 'Fractions are real numbers on the number line between 0 and 1. More slices means each individual slice must be smaller—which is why 1/8 of a pizza is smaller than 1/4 of that same pizza!',
    proTip: 'Remember: Denominator = "Down" (bottom number). Numerator = "Number of pieces you get" (top number).',
    encouragement: 'Fractions used to confuse grown-ups too! Once you picture equal slices, you hold a superpower.',
    interactiveType: 'fraction_bars',
    interactiveData: { defaultNumerator: 3, defaultDenominator: 4 },
    practicePrompt: {
      problemText: 'Leo shared a large waffle equally among 4 friends. What fraction of the waffle did each friend get? If Leo ate 3 of those pieces, what fraction did he eat?',
      scaffoldType: 'fractions',
      scaffoldData: { numeratorA: 3, denominatorA: 4, operation: '=' },
    },
    tags: ['fractions', 'numerator', 'denominator', 'equal parts', 'unit fractions'],
  },
  {
    id: 'g3-arrays-multiplication',
    title: 'Multiplication as Rows & Columns (Arrays)',
    grade: '3rd',
    category: 'Multiplication & Division',
    oneLiner: 'Multiplication means counting equal rows and columns instead of counting one-by-one.',
    metaphor: {
      title: '🧁 The Bakery Cookie Tray',
      story: 'When a baker places cookies on a tray in 4 rows of 6, they do not count 1, 2, 3... up to 24. They glance and see 4 groups of 6! Turn the tray sideways and it is 6 rows of 4—still 24 cookies!',
    },
    whyItWorks: 'This proves the Commutative Property (a × b = b × a). An array organizes numbers into a rectangular grid where Area = Rows × Columns.',
    proTip: 'Whenever you get stuck on a multiplication fact like 7 × 4, split it into friendly rows: (5 × 4) + (2 × 4) = 20 + 8 = 28!',
    encouragement: 'You don’t have to memorize a hundred random facts; you just need to know how to build arrays!',
    interactiveType: 'array_grid',
    interactiveData: { defaultRows: 4, defaultCols: 6 },
    practicePrompt: {
      problemText: 'A classroom library shelf has 5 rows of chapter books with 7 books in each row. How many books are on the shelf in total? Draw an array to prove it.',
      scaffoldType: 'array_grid',
      scaffoldData: { rows: 5, cols: 7, highlightRows: 5, highlightCols: 7, label: '5 rows × 7 columns = 35' },
    },
    tags: ['multiplication', 'arrays', 'rows', 'columns', 'commutative property', 'area'],
  },
  {
    id: 'g3-open-number-line',
    title: 'The Open Number Line (Friendly Jumps)',
    grade: '3rd',
    category: 'Number Sense & Mental Math',
    oneLiner: 'Solve addition and subtraction by jumping along an open line in friendly chunks of 10 and 100.',
    metaphor: {
      title: '🐸 The Frog on Lily Pads',
      story: 'A frog starting at pad 38 does not hop 36 tiny steps to reach 74. It hops +2 to land on friendly 40, leaps +30 to 70, and takes +4 more to land right on 74! Total hops: 2 + 30 + 4 = 36.',
    },
    whyItWorks: 'Our brain thinks naturally in base-ten landmarks (10, 20, 50, 100). Jumping to the nearest friendly ten eliminates the anxiety of carrying or borrowing numbers in your head.',
    proTip: 'For subtraction like 82 - 39: jump backward to 40 first, or start at 39 and jump forward to 82 to find the difference!',
    encouragement: 'Mathematicians love shortcuts, and the open number line is the ultimate mental road map!',
    interactiveType: 'number_line_jumps',
    interactiveData: { start: 38, target: 74, jumps: [{ size: 2, to: 40 }, { size: 30, to: 70 }, { size: 4, to: 74 }] },
    practicePrompt: {
      problemText: 'Maya had 47 stickers. Her teacher gave her 38 more. Use friendly jumps on an open number line to find how many stickers Maya has now.',
      scaffoldType: 'number_line',
      scaffoldData: { min: 40, max: 90, start: 47, jumpSize: 3, jumpsCount: 1, target: 85 },
    },
    tags: ['number line', 'addition', 'subtraction', 'mental math', 'friendly tens'],
  },
  {
    id: 'g3-area-vs-perimeter',
    title: 'Area vs. Perimeter: Carpet vs. Fence',
    grade: '3rd',
    category: 'Geometry & Measurement',
    oneLiner: 'Perimeter is the walking distance around the rim; Area is the flat space filling the inside.',
    metaphor: {
      title: '🏡 The Backyard Dog Run',
      story: 'Perimeter is the wooden fence around the edge so the puppy doesn’t run away (count single units: feet or meters). Area is the green grass inside the yard where the puppy rolls around (count square tiles: square feet)!',
    },
    whyItWorks: 'Perimeter is 1-dimensional (length + width + length + width). Area is 2-dimensional (length × width) because it counts how many 1×1 unit squares cover the entire surface without overlapping.',
    proTip: 'Look at the units! If the answer is in "square inches" (sq in), it is Area. If it is in regular "inches" (in), it is Perimeter.',
    encouragement: 'Once you imagine the fence and the carpet, you will never mix up area and perimeter again!',
    interactiveType: 'area_vs_perimeter',
    interactiveData: { width: 5, height: 3 },
    practicePrompt: {
      problemText: 'A rectangular sandbox is 6 feet long and 4 feet wide. How much wooden border is needed to build the fence around it (perimeter), and how many square feet of sand fill the bottom (area)?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['area', 'perimeter', 'geometry', 'square units', 'rectangles'],
  },
  {
    id: 'g3-constant-difference',
    title: 'Constant Difference: Shifting Subtraction',
    grade: '3rd',
    category: 'Number Sense & Mental Math',
    oneLiner: 'Shift both numbers in a subtraction problem by the same amount to eliminate borrowing across zeros.',
    metaphor: {
      title: '📏 The Walking Tape Measure',
      story: 'If you and your friend are standing 4 feet apart and both take 1 step forward, are you still 4 feet apart? YES! The distance between two numbers never changes if you slide them together!',
    },
    whyItWorks: 'To solve 500 - 297, subtract 1 from BOTH numbers: 499 - 296 = 203! No borrowing across zeros, no messy cross-outs, and 100% correct.',
    proTip: 'Whenever you see zeros on top (like 1,000 or 400), subtract 1 from both numbers to get 999 or 399 and solve in 5 seconds flat!',
    encouragement: 'You just learned one of the coolest mathematical magic tricks used by college math professors!',
    interactiveType: 'constant_difference',
    interactiveData: { numA: 500, numB: 297, shift: -1 },
    practicePrompt: {
      problemText: 'A bookstore had 600 books in stock and sold 389 of them during a weekend festival. Use the constant difference strategy (shifting both numbers by 1) to find how many books remain.',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['subtraction', 'constant difference', 'mental math', 'regrouping', 'zeros'],
  },

  // ==========================================
  // GRADE 4 CONCEPTS
  // ==========================================
  {
    id: 'g4-area-model-partial-products',
    title: 'Area Model & Partial Products for Multiplication',
    grade: '4th',
    category: 'Multiplication & Division',
    oneLiner: 'Break large two-digit multiplication into 4 friendly rectangular rooms, then add the room areas.',
    metaphor: {
      title: '🏠 The 4-Room Math House',
      story: 'To multiply 24 × 18, don’t panic! Build a 4-room house. Split 24 into 20 + 4, and 18 into 10 + 8. Now find the size of each room: Big Living Room (20×10 = 200), Kitchen (20×8 = 160), Bedroom (4×10 = 40), and Balcony (4×8 = 32). Add all rooms: 200 + 160 + 40 + 32 = 432!',
    },
    whyItWorks: 'This is the Distributive Property in action: (20 + 4) × (10 + 8). It reveals exactly why the old vertical algorithm requires adding a zero on the second row—because you are multiplying by tens, not single ones!',
    proTip: 'Always check that you have 4 partial products before adding them up. Missing a room is the #1 mistake!',
    encouragement: 'The Area Model is so powerful that high schoolers use this exact same box to multiply algebra polynomials in 9th grade!',
    interactiveType: 'partial_products',
    interactiveData: { num1: 24, num2: 18 },
    practicePrompt: {
      problemText: 'A school auditorium has 23 rows of seats with 16 seats in each row. Use the area model with 4 partial products to calculate the total seating capacity.',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['multiplication', 'area model', 'partial products', 'distributive property', 'multi-digit'],
  },
  {
    id: 'g4-multiplicative-comparison',
    title: 'Multiplicative Comparison ("Times as Many")',
    grade: '4th',
    category: 'Algebraic & Spatial Thinking',
    oneLiner: 'Distinguish between adding more items ("plus") versus scaling by a multiplier ("times as many").',
    metaphor: {
      title: '🔭 The Telescope Magnifier',
      story: 'If Ben has 4 toy cars and Sarah has "3 more cars", Sarah has 4 + 3 = 7 cars. But if Sarah has "3 times as many cars as Ben", she has 3 groups of 4 = 12 cars! Multiplicative comparison is like zooming in with a telescope.',
    },
    whyItWorks: 'Multiplicative comparison compares two quantities by showing that one quantity is a specific multiple of the other ($A = c \times B$). This is the foundation of ratios and scale models.',
    proTip: 'Look for key words: "times as many as", "times older", "twice as long". Draw tape diagram bars to see the copies!',
    encouragement: 'Understanding "times as many" is the big doorway connecting elementary arithmetic to middle school algebra!',
    interactiveType: 'multiplicative_comparison',
    interactiveData: { baseAmount: 4, multiplier: 3 },
    practicePrompt: {
      problemText: 'Elena read 6 books this month. Her older brother Marcus read 4 times as many books as Elena. How many books did Marcus read, and how many did they read altogether?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['multiplicative comparison', 'word problems', 'ratios', 'algebraic thinking', 'scaling'],
  },
  {
    id: 'g4-equivalent-fractions-multiplying-one',
    title: 'Equivalent Fractions (The Power of Multiplying by 1)',
    grade: '4th',
    category: 'Fractions & Decimals',
    oneLiner: 'Multiply the numerator and denominator by the same number to cut pieces smaller without changing the amount.',
    metaphor: {
      title: '🪞 The Magic Multi-Mirror',
      story: 'When you look into a mirror, you don’t change into a different person—you just see your reflection! In math, 2/2 or 3/3 or 4/4 equals 1 whole. Multiplying 1/2 by 2/2 gives 2/4. Same amount of pizza, just cut into smaller slices!',
    },
    whyItWorks: 'Any number multiplied by 1 stays equal to itself ($a/b \times n/n = a/b$). Both the number of parts shaded and the total parts in the whole grow by the same factor, so the fraction occupies the exact same spot on the number line.',
    proTip: 'Whatever you do to the top (numerator), you MUST do to the bottom (denominator) so you are multiplying by 1 whole!',
    encouragement: 'You are manipulating numbers while keeping them true and equal—that is real mathematical artistry!',
    interactiveType: 'fraction_bars',
    interactiveData: { defaultNumerator: 1, defaultDenominator: 2, equivalentNumerator: 2, equivalentDenominator: 4 },
    practicePrompt: {
      problemText: 'Show why 3/4 is equivalent to 9/12. What number did you multiply both the numerator and denominator by?',
      scaffoldType: 'fractions',
      scaffoldData: { numeratorA: 3, denominatorA: 4, numeratorB: 9, denominatorB: 12, operation: 'compare' },
    },
    tags: ['equivalent fractions', 'fractions', 'identity property', 'number line', 'simplifying'],
  },
  {
    id: 'g4-decimals-tenths-hundredths',
    title: 'Decimals: Tenths, Hundredths & Money',
    grade: '4th',
    category: 'Fractions & Decimals',
    oneLiner: 'Decimals are just another way to write fractions with denominators of 10, 100, or 1000.',
    metaphor: {
      title: '🪙 Dimes and Pennies in Your Pocket',
      story: 'Think of 1 whole dollar ($1.00) as the whole. A dime is 1/10 of a dollar, written as 0.1 or 0.10. A penny is 1/100 of a dollar, written as 0.01. So $0.45 is 4 dimes and 5 pennies (45 hundredths)!',
    },
    whyItWorks: 'Our number system is base-ten. As you move right past the decimal point, each spot is 10 times smaller: Ones $\div 10 \rightarrow$ Tenths $\div 10 \rightarrow$ Hundredths. That is why 0.3 (3 dimes = 30 cents) is bigger than 0.08 (8 pennies = 8 cents)!',
    proTip: 'When comparing decimals like 0.4 and 0.38, add an invisible zero to balance the digits: compare 0.40 and 0.38! 40 hundredths is clearly larger than 38 hundredths.',
    encouragement: 'Decimals are everywhere—in grocery stores, sports scores, and science labs. You already use them every day!',
    interactiveType: 'decimal_hundredths',
    interactiveData: { decimalA: 0.4, decimalB: 0.35 },
    practicePrompt: {
      problemText: 'Which is greater: 0.5 or 45/100? Use money or a hundredths grid to explain your reasoning.',
      scaffoldType: 'fractions',
      scaffoldData: { numeratorA: 5, denominatorA: 10, numeratorB: 45, denominatorB: 100, operation: 'compare' },
    },
    tags: ['decimals', 'place value', 'tenths', 'hundredths', 'money', 'comparing decimals'],
  },
  {
    id: 'g4-angles-circular-turns',
    title: 'Angles as Turns & Protractor Measurement',
    grade: '4th',
    category: 'Geometry & Measurement',
    oneLiner: 'An angle measures how far a ray has turned around a circle, from 0° to a full 360° spin.',
    metaphor: {
      title: '🛹 The Skateboarder 360° Spin',
      story: 'When a skateboarder spins all the way around in a circle and lands facing forward, that is a "360"! A half spin is 180° (a straight line). A quarter turn is a crisp 90° square corner (a right angle, like the corner of a book).',
    },
    whyItWorks: 'A circle is divided into 360 equal 1-degree wedges. Angles are additive: if you put a 30° angle and a 60° angle right next to each other, they make a 90° right angle!',
    proTip: 'When using a protractor, ask yourself first: "Is this angle sharp and acute (smaller than 90°), or wide and obtuse (bigger than 90°)?" That stops you from reading the wrong number scale!',
    encouragement: 'Angle geometry is the secret code behind video game engines, architecture, and roller coaster design!',
    interactiveType: 'clock_fractions',
    interactiveData: { angleDegrees: 90, angleType: 'Right Angle' },
    practicePrompt: {
      problemText: 'The hands on a clock show 3:00. What is the angle between the hour and minute hands? What will the angle be at 6:00?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['angles', 'degrees', 'protractor', 'acute', 'obtuse', 'right angle', 'geometry'],
  },

  // ==========================================
  // GRADE 5 CONCEPTS
  // ==========================================
  {
    id: 'g5-unlike-fractions-clock-model',
    title: 'Adding Unlike Fractions (The Clock & Money Secret)',
    grade: '5th',
    category: 'Fractions & Decimals',
    oneLiner: 'Convert unlike fractions to a common denominator using familiar clocks (twelfths/sixtieths) or money (hundredths).',
    metaphor: {
      title: '⏰ The Clock Face Denominator',
      story: 'Why does 1/3 + 1/4 = 7/12? Look at a clock! 1/3 of an hour is 20 minutes (4 five-minute chunks). 1/4 of an hour is 15 minutes (3 five-minute chunks). 20 min + 15 min = 35 minutes! Since each 5 minutes is 1/12 of an hour, 35 minutes is 7 twelfths (7/12)!',
    },
    whyItWorks: 'You cannot add different units (like 1 apple + 1 orange). Fractions with different denominators represent different sized pieces. Finding a common denominator translates both fractions into the exact same sized pieces so you can count them up!',
    proTip: 'Use benchmark models: clocks for 1/2, 1/3, 1/4, 1/6, and 1/12. Use coins for 1/2 ($0.50), 1/4 ($0.25), and 1/10 ($0.10)!',
    encouragement: 'No more memorizing giant multiplication tables to find common denominators—the clock is already in your mind!',
    interactiveType: 'clock_fractions',
    interactiveData: { fractionA: '1/3', fractionB: '1/4', minutesA: 20, minutesB: 15, sumMinutes: 35 },
    practicePrompt: {
      problemText: 'Jordan walked for 1/3 of an hour and jogged for 1/4 of an hour. What fraction of an hour was Jordan exercising in total? Use a clock model or common denominator to solve.',
      scaffoldType: 'fractions',
      scaffoldData: { numeratorA: 1, denominatorA: 3, numeratorB: 1, denominatorB: 4, operation: '+' },
    },
    tags: ['fractions', 'unlike denominators', 'addition', 'clock fractions', 'common denominator'],
  },
  {
    id: 'g5-multiplying-fractions-area-overlap',
    title: 'Multiplying Fractions (Fraction of a Fraction)',
    grade: '5th',
    category: 'Fractions & Decimals',
    oneLiner: 'Multiplying fractions means finding a fractional part of another fraction using overlapping grids.',
    metaphor: {
      title: '🍫 The Brownie Pan Overlap',
      story: 'Mom left 3/4 of a pan of brownies on the kitchen counter. You get to eat 1/2 of what is left (1/2 of 3/4). Cut the pan vertically into 4 strips and shade 3. Then cut horizontally in half. The double-shaded overlapping tiles show you got 3 out of 8 total pieces (3/8)!',
    },
    whyItWorks: 'In multiplication, "of" means multiply: $\frac{1}{2} \times \frac{3}{4} = \frac{1 \times 3}{2 \times 4} = \frac{3}{8}$. Multiplying by a fraction smaller than 1 scales the quantity down, which is why the answer is smaller than either starting number!',
    proTip: 'When multiplying fractions, multiply straight across the top (numerators) and straight across the bottom (denominators). No common denominator needed!',
    encouragement: 'Seeing that multiplication can make numbers smaller blows most students’ minds—you are mastering high-level math!',
    interactiveType: 'fraction_bars',
    interactiveData: { defaultNumerator: 1, defaultDenominator: 2, multiplierNum: 3, multiplierDen: 4 },
    practicePrompt: {
      problemText: 'A recipe calls for 2/3 cup of milk. If you only want to make 1/2 of the recipe, how much milk should you measure? Draw an area model to show 1/2 × 2/3.',
      scaffoldType: 'fractions',
      scaffoldData: { numeratorA: 1, denominatorA: 2, numeratorB: 2, denominatorB: 3, operation: '=' },
    },
    tags: ['multiplying fractions', 'area model', 'fraction of a fraction', 'scaling', 'rational numbers'],
  },
  {
    id: 'g5-dividing-fractions-unit-slices',
    title: 'Dividing Whole Numbers by Unit Fractions',
    grade: '5th',
    category: 'Fractions & Decimals',
    oneLiner: 'Dividing asks: "How many of these smaller portions fit inside the whole group?"',
    metaphor: {
      title: '🎂 The Birthday Cake Scoops',
      story: 'Why does 4 ÷ 1/3 = 12? If you have 4 whole cakes and cut each cake into 1/3-size slices, how many slices do you get? Each cake gives 3 slices. 4 cakes × 3 slices = 12 slices! You end up with MORE pieces because each piece is smaller!',
    },
    whyItWorks: 'Division is the inverse of multiplication. Asking "What is 4 divided by 1/3?" is asking "How many 1/3s are in 4?" Since 3 one-thirds make 1 whole, 4 wholes contain $4 \times 3 = 12$ one-thirds.',
    proTip: 'Before solving, ask yourself: "Am I cutting into tiny pieces (answer gets bigger), or sharing a tiny piece among friends (answer gets smaller)?"',
    encouragement: 'You understand the real meaning of fraction division, not just a blind "keep-change-flip" memory trick!',
    interactiveType: 'fraction_bars',
    interactiveData: { wholeNumber: 4, unitFractionDenominator: 3, totalPieces: 12 },
    practicePrompt: {
      problemText: 'A chef has 5 pounds of flour. Each batch of biscuits requires 1/4 pound of flour. How many batches of biscuits can the chef bake?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['dividing fractions', 'unit fractions', 'measurement division', 'fractions', 'word problems'],
  },
  {
    id: 'g5-volume-stacking-layers',
    title: 'Volume as Stacking Layers (3D Space)',
    grade: '5th',
    category: 'Geometry & Measurement',
    oneLiner: 'Volume measures 3D space by calculating the base floor area and multiplying by the number of floors high.',
    metaphor: {
      title: '🏢 The Skyscraper Apartment Building',
      story: 'Picture an apartment tower. The bottom floor has 4 rows of 5 square rooms (Base Area = 4 × 5 = 20 rooms). If the building is 3 stories tall, how many rooms in total? 20 rooms on floor 1 + 20 on floor 2 + 20 on floor 3 = 60 cubic rooms! Volume = Base × Height!',
    },
    whyItWorks: 'Volume fills three dimensions: Length × Width × Height ($V = l \times w \times h$). Since $l \times w = \text{Base Area } (B)$, we can also write $V = B \times h$. Units are always cubic (like $\text{cm}^3$ or $\text{in}^3$) because they count 3D unit cubes.',
    proTip: 'If a problem already gives you the "Base Area", don’t multiply length and width again! Just multiply Base Area × Height.',
    encouragement: 'You are thinking in three dimensions like an architect or video game 3D modeler!',
    interactiveType: 'volume_layers',
    interactiveData: { length: 5, width: 4, height: 3 },
    practicePrompt: {
      problemText: 'A shipping box has a rectangular base measuring 8 inches by 5 inches. The box is 6 inches tall. What is the total volume in cubic inches?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['volume', '3D geometry', 'cubic units', 'rectangular prism', 'layers'],
  },
  {
    id: 'g5-powers-of-ten-place-value-shift',
    title: 'Powers of 10 & Place Value Runway Shifts',
    grade: '5th',
    category: 'Number Sense & Mental Math',
    oneLiner: 'Multiplying by 10 shifts all digits one place to the left; dividing by 10 shifts all digits one place to the right.',
    metaphor: {
      title: '🛫 The Place Value Airport Runway',
      story: 'The decimal point NEVER moves! It is cemented into the ground like a control tower. When you multiply 45 by 10, the digits 4 and 5 slide one seat to the left on the runway: the 4 moves from Tens to Hundreds, the 5 moves from Ones to Tens, and a 0 fills the empty Ones chair (450)!',
    },
    whyItWorks: 'Each position in our base-10 system is worth 10 times the place to its right ($10^1 = 10, 10^2 = 100, 10^3 = 1,000$). Multiplying by $10^2$ (100) shifts digits two places left; dividing shifts two places right.',
    proTip: 'Watch out for decimals: $3.4 \times 10 = 34$ (NOT 3.40!). Adding a zero to the end of a decimal doesn’t change its value, but shifting the digit 3 to the tens place does!',
    encouragement: 'Seeing digits slide across place value columns is how professional computer scientists think about binary and base systems!',
    interactiveType: 'powers_of_ten',
    interactiveData: { baseValue: 45, exponent: 1 },
    practicePrompt: {
      problemText: 'A scientist measures a microscopic organism at 0.038 millimeters. If a microscope magnifies it by 10^3 (1,000 times), what is the magnified size in millimeters?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['powers of 10', 'place value', 'exponents', 'decimals', 'metric system'],
  },
  {
    id: 'g5-coordinate-plane-walk-then-fly',
    title: 'The Coordinate Plane: Walk Along the Hall, Then Fly!',
    grade: '5th',
    category: 'Algebraic & Spatial Thinking',
    oneLiner: 'Plot points $(x, y)$ by moving right along the ground axis first, then moving up along the vertical axis.',
    metaphor: {
      title: '🏢 The Hotel Lobby and Elevator',
      story: 'When you enter a grand hotel at $(0, 0)$, you can’t jump straight up into the ceiling! You must walk along the hallway floor first to your elevator bank ($x$-axis), and THEN step inside the elevator to ride up to your room floor ($y$-axis)!',
    },
    whyItWorks: 'An ordered pair $(x, y)$ always lists $x$ first (horizontal distance from the origin) and $y$ second (vertical distance from the origin). Reversing them puts you in the wrong room: $(2, 5)$ is 2 steps right and 5 steps up, while $(5, 2)$ is 5 steps right and 2 steps up!',
    proTip: 'Remember alphabetical order: $X$ comes before $Y$ in the alphabet, so $X$ comes first in $(x, y)$! Walk along the ground, then fly into the sky.',
    encouragement: 'Coordinate grids are how GPS maps navigate cities, how drones fly, and how Minecraft maps every block in the world!',
    interactiveType: 'coordinate_plane',
    interactiveData: { targetX: 4, targetY: 6 },
    practicePrompt: {
      problemText: 'A pirate buried treasure at coordinate (6, 3). Explain step-by-step how to start from the origin (0, 0) and find the exact spot on the map. What would happen if you plotted (3, 6) instead?',
      scaffoldType: 'none',
      scaffoldData: {},
    },
    tags: ['coordinate plane', 'ordered pairs', 'x-axis', 'y-axis', 'graphing', 'origin'],
  },
];
