// handle an exception and move along

import java.util.Random;

class HandleError {
	public static void main(String args[]) {
		int a = 0, b = 0, c = 0, divZeroCounter = 0;
		
		Random r = new Random();
		
		for(int i = 0; i < 32000; i++) {
			try {
				b = r.nextInt();
				c = r.nextInt();
				a = 12345 / (b/c);
			} catch (ArithmeticException e) {
				System.out.println("Division by zero");
				divZeroCounter++;
				a = 0; // set a to zero and continue
			}
			System.out.println("a: " + a);
		}
		// what percentage of the time is division by zero attempted?
		double percentage = divZeroCounter/32000.00;
		System.out.println(percentage);
	
	}
}