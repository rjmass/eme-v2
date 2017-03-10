export default () => {
  return (BaseComponent) => class DialogComponent extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = { ...this.state || {}, dialogs: {} };
    }

    closeDialog(name) {
      const { dialogs } = this.state;
      dialogs[name] = false;
      this.setState({ dialogs });
    }

    openDialog(name) {
      const { dialogs } = this.state;
      dialogs[name] = true;
      this.setState({ dialogs });
    }
  };
};
