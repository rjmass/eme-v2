export default () => {
  return (BaseComponent) => class CollapseComponent extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = { ...this.state || {}, collapse: {} };
    }

    toggleCollapse(name) {
      const { collapse } = this.state;
      const value = !collapse[name];
      this.setState({ collapse: { [name]: value } });
    }

    collapseState(name) {
      const { collapse } = this.state;
      return !!collapse[name];
    }

  };
};
