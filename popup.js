function data() {
  return {
    sb_on: true,
    sb_ignoredUsers: "",
    sb_blur: false,
    sb_saved: false,
    save() {
      chrome.storage.local.set(
        {
          settings: {
            sb_on: this.sb_on,
            sb_ignoredUsers: this.sb_ignoredUsers,
            sb_blur: this.sb_blur,
          },
        },
        () => {
          this.sb_saved = true;
        }
      );
    },
    init() {
      const isDefined = (v) => v !== undefined;

      chrome.storage.local.get("settings", (result) => {
        const { sb_on, sb_ignoredUsers, sb_blur } = result.settings || {};

        if (isDefined(sb_on)) {
          this.sb_on = sb_on;
        }

        if (isDefined(sb_ignoredUsers)) {
          this.sb_ignoredUsers = sb_ignoredUsers;
        }

        if (isDefined(sb_blur)) {
          this.sb_blur = sb_blur;
        }
      });
    },
  };
}
