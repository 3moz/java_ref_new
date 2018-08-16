// this contains an error and will not actually compile

//class ThrowsDemo {
//	static void throwOne() {
//		System.out.println("Inside throwOne");
//		throw new IllegalAccessException("demo");
//	}
//	public static void main(String args[]) {
//		throwOne();
//	}
//}

//This below is a legal version
class ThrowsDemo {
	static void throwOne() throws IllegalAccessException {
		System.out.println("Inside throwOne");
		throw new IllegalAccessException("demo");
	}
	public static void main(String args[]) {
		try {
			throwOne();
		} catch (IllegalAccessException e) {
			System.out.println("Caught " + e);
		}
	}
}