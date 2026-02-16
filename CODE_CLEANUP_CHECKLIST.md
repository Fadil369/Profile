# Code Cleanup Checklist

This document identifies potentially unused or redundant code that can be cleaned up.

## JavaScript Files - Unused/Optional

### Confirmed Unused (Can be removed if verified)
1. **assets/js/newsletter.js** 
   - Status: Newsletter feature disabled in _config.yml (`newsletter.enabled: false`)
   - Size: ~4KB
   - Action: Can be removed since newsletter is disabled
   - File: `/assets/js/newsletter.js`

2. **assets/js/wechat.js**
   - Status: No wechat_qr usage found in any pages
   - Size: ~3.1KB
   - Action: Can be removed if WeChat integration not planned
   - File: `/assets/js/wechat.js`

### Conditionally Used (Keep but document)
These are loaded conditionally based on page configuration:

3. **assets/js/chartjs-setup.js** - Only loaded if page has charts
4. **assets/js/plotly-setup.js** - Only loaded if page uses Plotly
5. **assets/js/leaflet-setup.js** - Only loaded if page uses Leaflet maps
6. **assets/js/mermaid-setup.js** - Only loaded if page has mermaid diagrams
7. **assets/js/jupyter_new_tab.js** - Only for Jupyter notebooks
8. **assets/js/pseudocode-setup.js** - Only for pseudocode rendering
9. **assets/js/echarts-setup.js** - Only for echarts visualizations
10. **assets/js/diff2html-setup.js** - Only for diff visualization

## SCSS Files - Review

### Potential Simplification
1. **_sass/_themes.scss**
   - Review: Check if there are theme-related redundancies with _custom_extra.scss
   - Action: Audit for duplicate theme variables

2. **_sass/_base.scss**
   - Size: 1498 lines
   - Review: Check for styles now covered by premium components
   - Action: Audit for overlapping styles

## Include Files - Review

### Potentially Unused Includes
1. **_includes/newsletter.liquid**
   - Related to disabled newsletter feature
   - Can be kept for future use but not actively used

## Minified Vendor Files (Keep)
These are vendor libraries and should be kept:
- bootstrap.bundle.min.js (127KB) - Essential
- bootstrap-toc.min.js (3.1KB) - Table of contents
- vanilla-back-to-top.min.js (2.6KB) - Back to top button

## CSS Vendor Files (Keep)
- bootstrap.min.css (199KB) - Essential
- mdb.min.css (318KB) - Material Design Bootstrap
- jupyter.css - For notebook rendering

## Recommended Actions

### Priority 1 - Safe to Remove
```bash
# If newsletter permanently disabled:
rm assets/js/newsletter.js
# Update _includes/scripts.liquid to remove newsletter condition

# If WeChat not needed:
rm assets/js/wechat.js
# Update _includes/social.liquid to remove wechat_qr condition
```

### Priority 2 - Document
Add comments in code explaining:
- Which JS files are conditionally loaded
- What triggers each conditional script
- Dependencies between scripts

### Priority 3 - Future Optimization
- Consider combining small setup files
- Evaluate if all vendor libraries are necessary
- Profile actual usage on live site

## Size Impact

### If Newsletter & WeChat Removed
- JavaScript saved: ~7.1KB (unminified)
- Build time: Minimal impact
- Maintenance: Reduced code surface

### Current Asset Sizes
- Total JS: ~3.4MB (includes large vendor libs)
- Total CSS: ~1.7MB (includes large vendor libs)
- New additions: ~17KB (premium-animations.js)

## Notes

1. **Don't Remove Vendor Libraries**: Bootstrap, MDB, jQuery are core dependencies
2. **Keep Conditional Loaders**: They prevent unnecessary code from loading
3. **Test After Removal**: Always test site functionality after removing files
4. **Consider Future Use**: Newsletter feature might be enabled later
5. **Document Decisions**: Record why files were kept or removed

## Verification Commands

```bash
# Find files that reference newsletter
grep -r "newsletter" _layouts _includes _pages --include="*.liquid" --include="*.md"

# Find files that reference wechat
grep -r "wechat" _layouts _includes _pages --include="*.liquid" --include="*.md"

# Check file sizes
du -sh assets/js/*.js | sort -h

# List all JavaScript files
find assets/js -name "*.js" -type f | sort
```

## Timeline

- **Immediate**: Remove newsletter.js and wechat.js if confirmed unused
- **This Week**: Document conditional loading patterns
- **This Month**: Profile actual usage and optimize further

---

**Last Updated**: February 16, 2026  
**Status**: Ready for Review
