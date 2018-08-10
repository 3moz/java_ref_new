public interface MyIF {
	// this is a 'normal' interface method declaration
	// it does not define a default implementation
	int getNumber();
	
	// this is a default method - notice it provide a default implementation
	default String getString() {
		return "default string";
	}
	
	//this is a static interface method.
	static int getDefaultNumber() {
		return 0;
	}
	
	int defNum = MyIF.getDefaultNumber();

}