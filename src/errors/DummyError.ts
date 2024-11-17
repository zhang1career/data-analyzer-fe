class DummyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Dummy';
  }
}

export default DummyError;