
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchGroups = (customGroups) => {
  try {
    const groups = JSON.parse(customGroups);
    if (groups.constructor === Array && groups.length > 0) {
      return groups;
    }
    return null;
  } catch(err) {
    console.log("Error when parsing groups")
    console.log(err);
    return null;
  }
}

module.exports = { fetchGroups, formatDate }