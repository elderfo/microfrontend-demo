import React from 'react';

interface MicroFrontendProps {
  name: string;
  host: string;
  document: Document;
  window: typeof window;
}

class MicroFrontend extends React.Component<MicroFrontendProps> {
  static defaultProps = {
    document,
    window,
  };

  componentDidMount() {
    const { name, host, document } = this.props;
    const scriptId = `micro-frontend-script-${name}`;

    if (document.getElementById(scriptId)) {
      this.renderMicroFrontend();
      return;
    }

    // fetch(`${host}/asset-manifest.json`)
    //   .then((res) => res.json())
    //   .then((manifest) => {
    //     const script = document.createElement('script');
    //     script.id = scriptId;
    //     script.crossOrigin = '';
    //     script.src = `${host}${manifest['main.js']}`;
    //     script.onload = this.renderMicroFrontend;
    //     document.head.appendChild(script);
    //   });

    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const promises = Object.keys(manifest['files'])
          .filter((key) => key.endsWith('.js'))
          .reduce((sum, key) => {
            sum.push(
              new Promise((resolve) => {
                const path = `${host}${manifest['files'][key]}`;
                const script = document.createElement('script');
                if (key === 'main.js') {
                  script.id = scriptId;
                }
                script.onload = () => {
                  resolve();
                };
                script.src = path;
                document.body.after(script);
              })
            );
            return sum;
          }, [] as Promise<void>[]);

        Promise.allSettled(promises).then(() => {
          this.renderMicroFrontend();
        });
      });
  }

  componentWillUnmount() {
    const { name, window } = this.props;
    const wnd = window as any;
    wnd[`unmount${name}`](`${name}-container`);
  }

  renderMicroFrontend = () => {
    const { name, window } = this.props;
    const wnd = window as any;
    wnd[`render${name}`](`${name}-container`);
  };

  render() {
    return <main id={`${this.props.name}-container`} />;
  }
}

export default MicroFrontend;
