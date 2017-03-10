export default (pageSize = 20) => {
  return (BaseComponent) => class PagerComponent extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = { ...this.state || {}, page: 1, pageSize };
    }

    getCurrentPageList(list = this.props.list) {
      const { page } = this.state;
      return list.slice(pageSize * (page - 1), pageSize * page);
    }

    handlePageChange(page) {
      this.setState({ page });
    }

  };
};
