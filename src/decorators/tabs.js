export default (defaultTab = 'html') => {
  return (BaseComponent) => class Tabbed extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = { ...this.state, tab: defaultTab };
    }

    handleTabSelect(tab) {
      this.setState({ tab });
    }
  };
};
