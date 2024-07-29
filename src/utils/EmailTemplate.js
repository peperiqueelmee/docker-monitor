class EmailTemplate {
  static createEmailBody(addedOrModifiedContainers, removedContainers, previousState) {
    const tableRows = [];

    addedOrModifiedContainers.forEach(diff => {
      const prev = previousState.find(container => container.id === diff.id);
      if (prev) {
        if (prev.state !== diff.state) {
          const row = `<tr>
                <td>${diff.name}</td>
                <td>${diff.image}</td>
                <td>${prev.state}</td>
                <td>${diff.state}</td>
              </tr>`;
          tableRows.push(row);
        }
      } else {
        const row = `<tr>
              <td>${diff.name}</td>
              <td>${diff.image}</td>
              <td>-</td>
              <td>${diff.state}</td>
            </tr>`;
        tableRows.push(row);
      }
    });

    removedContainers.forEach(container => {
      const row = `<tr>
            <td>${container.name}</td>
            <td>${container.image}</td>
            <td>${container.state}</td>
            <td>removed</td>
          </tr>`;
      tableRows.push(row);
    });

    const table = `
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Previous State</th>
              <th>Current State</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join('')}
          </tbody>
        </table>`;

    return `
        <div>
          <img src="cid:docker-banner" alt="Docker-banner" style="width: 100%; max-width: 600px;">
        </div>
        <p>Dear User,</p>
        <p>The following containers have changed state:</p>ç
        ${table}
        <p>Best regards,<br>Your DevOps Monitoring Team.</p>`;
  }
}

module.exports = EmailTemplate;
