import React from "react";
import { headerFont } from "../../globalStyles";

const styles = {
  avatar: {
    marginRight: 5,
    marginBottom: 2
  },
  byline: {
    fontFamily: headerFont,
    fontSize: 15,
    marginLeft: 2,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 500,
    color: "#555",
    lineHeight: 1.4,
    verticalAlign: "middle"
  },
  bylineWeight: {
    fontFamily: headerFont,
    fontSize: 15,
    fontWeight: 500
  }
};

const Byline = ({width, metadata}) => {
  return (
    <div width={width} style={styles.byline}>
      {renderAvatar(metadata)}
      {renderBuildInfo(metadata)}
      {renderMaintainers(metadata)}
    </div>
  );
};

function renderAvatar(metadata) {
  const repo = metadata.buildUrl;
  if (typeof repo === 'string') {
    const match = repo.match(/(https?:\/\/)?(www\.)?github.com\/([^/]+)/);
    if (match) {
      return (
        <img style={styles.avatar} alt="avatar" width="28" src={`https://github.com/${match[3]}.png?size=200`}/>
      );
    }
  }
  return null;
}

/**
 * Render the byline of the page to indicate the source of the build (often a GitHub repo)
 */
function renderBuildInfo(metadata) {
  if (Object.prototype.hasOwnProperty.call(metadata, "buildUrl")) {
    const repo = metadata.buildUrl;
    if (typeof repo === 'string') {
      if (repo.startsWith("https://") || repo.startsWith("http://") || repo.startsWith("www.")) {
        return (
          <span>
            {"Built with "}
            <Link url={repo}>
              {repo.replace(/^(http[s]?:\/\/)/, "").replace(/^www\./, "")}
            </Link>
            <PotentialGisaidExtraByline/>
            {". "}
          </span>
        );
      }
    }
  }
  return null;
}

/** Additional byline content to be added when certain criteria met.
 * This was introduced during the 2019 nCoV outbreak. In the future this
 * design should be switched a JSON key or a nextstrain.org auspice customisation
 */
function PotentialGisaidExtraByline() {
  if (
    window.location.hostname === "nextstrain.org" && // use "localhost" for testing
    window.location.pathname.startsWith("/ncov")
  ) {
    return (
      <span>
        {" using data from "}
        <a key={1} href="https://gisaid.org" target="_blank" rel="noopener noreferrer">
          <img src="https://www.gisaid.org/fileadmin/gisaid/img/schild.png" alt="gisaid-logo" width="65"/>
        </a>
      </span>
    );
  }
  return null;
}

function renderMaintainers(metadata) {
  let maintainersArray;
  if (Object.prototype.hasOwnProperty.call(metadata, "maintainers")) {
    maintainersArray = metadata.maintainers;
    if (Array.isArray(maintainersArray) && maintainersArray.length) {
      return (
        <span>
          {"Maintained by "}
          {maintainersArray.map((m, i) => (
            <React.Fragment key={m.name}>
              {m.url ? <Link url={m.url}>{m.name}</Link> : m.name}
              {i === maintainersArray.length-1 ? "" : i === maintainersArray.length-2 ? " and " : ", "}
            </React.Fragment>
          ))}
          {"."}
        </span>
      );
    }
  }
  return null;
}

function Link({url, children}) {
  return (
    <a style={styles.bylineWeight} rel="noopener noreferrer" href={url} target="_blank">
      {children}
    </a>
  );
}


export default Byline;
