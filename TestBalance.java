import mypack.*;

class TestBalance {
	public static void main(String args[]) {
		/*Because Balance is public we may use Balance
		 * class and call its constructor.
		 * */
		Balance test = new Balance("J. J. Jaspers", 99.88);
		
		test.show();
	}
}