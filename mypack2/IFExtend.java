package mypack2;
// an interface can extend another interface

interface A {
	void meth1();
	void meth2();
}

// B now includes meth1() and meth2() -- it adds meth3()

interface B extends A {
	void meth3();
}

// this class must implement all of A and B
class MyClass implements B {
	public void meth1() {
		System.out.println("implement meth1().");
	}
	public void meth2() {
		System.out.println("implement meth2().");
	}
	public void meth3() {
		System.out.println("implement meth3().");
	}
}

class IFExtend {
	public static void main(String args[]) {
		MyClass ob = new MyClass();
		
		ob.meth1();
		ob.meth2();
		ob.meth3();
	}
}