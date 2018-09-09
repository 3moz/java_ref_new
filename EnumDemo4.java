// demonstrate ordinal(), compareTo(), and equals()

// an enumeration of apple varieties

enum Apple1 {
	Jonathan, GoldenDel, RedDel, Winesap, Cortland
}

class EnumDemo4 {
	public static void main(String args[]) {
		Apple1 ap, ap2, ap3;
		
		// obtain all ordinal values using ordinal()
		System.out.println("Here are all the apple constants and their ordinal values:");
		for(Apple1 a : Apple1.values()) {
			System.out.println(a + " " + a.ordinal());
		}
		
		ap = Apple1.RedDel;
		ap2 = Apple1.GoldenDel;
		ap3 = Apple1.RedDel;
		
		System.out.println();
		
		// demonstrate compareTo() and equals()
		
		if(ap.compareTo(ap2) < 0) {
			System.out.println(ap + " comes before " + ap2);
		}
		
		if(ap.compareTo(ap2) > 0) {
			System.out.println(ap + " comes after " + ap2);
		}
		
		if(ap.compareTo(ap3) == 0) {
			System.out.println(ap + " equals" + ap3);
		}
		
		System.out.println();
		
		if(ap.equals(ap2)) {
			System.out.println("Error");
		}
		
		if(ap.equals(ap3)) {
			System.out.println(ap + " equals " + ap3);
		}
		
		if(ap == ap3) {
			System.out.println(ap + " == " + ap3);
		}
	}
}