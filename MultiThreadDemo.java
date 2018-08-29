// create multiple threads
class NewishThread implements Runnable {
	String name; // name of thread
	Thread t;
	
	NewishThread(String threadname) {
		name = threadname;
		t = new Thread(this, name);
		System.out.println("New thread: " + t);
		t.start(); // start the thread
	}
	
	// this is  entry point for thread
	public void run() {
		try {
			for(int i = 5; i > 0; i--) {
				System.out.println(name + ": " + i);
				Thread.sleep(1000);
			}
		} catch (InterruptedException e) {
			System.out.println(name + "Interrupted");
		}
		System.out.println(name + " exiting");
	}
}
class MultiThreadDemo {
	public static void main(String args[]) {
		new NewishThread("One");
		new NewishThread("Two");
		new NewishThread("Three");
			
		try {
			//wait for other threads to end
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			System.out.println("Main thread interrupted");
		}
		System.out.println("Main Thread exiting");
	}
}
