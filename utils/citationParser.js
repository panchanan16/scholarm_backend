/**
 * Citation Parser - Extracts structured data from various citation formats
 * Supports APA, MLA, Chicago, and other common academic citation styles
 */

class CitationParser {
    constructor() {
        // Common patterns for different citation elements
        this.patterns = {
            // Author patterns - enhanced for multiple authors
            author: /^([A-Z][a-z]+\s+[A-Z]{1,3}(?:,\s*[A-Z][a-z]+\s+[A-Z]{1,3})*(?:,\s*[A-Z][a-z]+\s+[A-Z]{1,3})*)/,
            authorWithYear: /^([A-Z][a-z]+(?:,\s*[A-Z]\.?)*(?:\s*&\s*[A-Z][a-z]+(?:,\s*[A-Z]\.?)*)*)\s*\((\d{4})\)/,
            multipleAuthors: /^([A-Z][a-z]+\s+[A-Z]{1,3}(?:,\s*[A-Z][a-z]+\s+[A-Z]{1,3})*)/,

            // Year patterns
            year: /\((\d{4})\)/,
            yearAtEnd: /(\d{4})\.?\s*$/,
            yearInText: /\.(\d{4});/,

            // DOI patterns
            doi: /(?:doi:|DOI:?)\s*([^\s,]+)/i,

            // URL patterns
            url: /(?:https?:\/\/[^\s,]+)/i,

            // Volume/Issue patterns
            volumeIssue: /(\d+)\((\d+)\)/,

            // Pages patterns - enhanced
            pages: /(?:pp?\.\s*)?(\d+(?:-\d+)?)/i,
            pagesWithColon: /:(\d+(?:[-–]\d+))/,

            // ISBN patterns
            isbn: /(?:ISBN:?\s*)?(\d{1,5}(?:-\d{1,7}){3,4}|\d{10}|\d{13})/i,

            // ISSN patterns
            issn: /(?:ISSN:?\s*)?(\d{4}-\d{4})/i
        };
    }

    /**
     * Main parsing function that determines citation type and extracts data
     * @param {string} citation - The citation string to parse
     * @returns {Object} - Parsed citation data with identified type
     */
    parseCitation(citation) {
        const trimmedCitation = citation.trim();

        // Determine citation type based on content and structure
        const type = this.identifyType(trimmedCitation);

        // Extract data based on identified type
        let extractedData;

        switch (type) {
            case 'journal-article':
                extractedData = this.parseJournalArticle(trimmedCitation);
                break;
            case 'book':
                extractedData = this.parseBook(trimmedCitation);
                break;
            case 'book-chapter':
                extractedData = this.parseBookChapter(trimmedCitation);
                break;
            case 'conference-paper':
                extractedData = this.parseConferencePaper(trimmedCitation);
                break;
            case 'thesis':
                extractedData = this.parseThesis(trimmedCitation);
                break;
            case 'report':
                extractedData = this.parseReport(trimmedCitation);
                break;
            case 'webpage':
                extractedData = this.parseWebpage(trimmedCitation);
                break;
            default:
                extractedData = this.parseGeneric(trimmedCitation);
                break;
        }

        return {
            type: type,
            data: extractedData,
            originalCitation: citation
        };
    }

    /**
     * Identifies the type of citation based on keywords and structure
     * @param {string} citation - The citation string
     * @returns {string} - The identified citation type
     */
    identifyType(citation) {
        const lowerCitation = citation.toLowerCase();

        // Check for thesis/dissertation keywords
        if (lowerCitation.includes('thesis') || lowerCitation.includes('dissertation') ||
            lowerCitation.includes('phd') || lowerCitation.includes('master')) {
            return 'thesis';
        }

        // Check for conference keywords
        if (lowerCitation.includes('conference') || lowerCitation.includes('proceedings') ||
            lowerCitation.includes('symposium') || lowerCitation.includes('workshop')) {
            return 'conference-paper';
        }

        // Check for report/guideline keywords - enhanced for government publications
        if (lowerCitation.includes('report') || lowerCitation.includes('technical report') ||
            lowerCitation.includes('working paper') || lowerCitation.includes('guidelines') ||
            lowerCitation.includes('guideline') || lowerCitation.includes('policy') ||
            lowerCitation.includes('manual') || lowerCitation.includes('protocol')) {
            return 'report';
        }

        // Check for government/institutional publications
        if (lowerCitation.includes('nhm') || lowerCitation.includes('goi') ||
            lowerCitation.includes('ministry') || lowerCitation.includes('department') ||
            lowerCitation.includes('government') || lowerCitation.includes('who') ||
            lowerCitation.includes('cdc') || lowerCitation.includes('national')) {
            return 'report';
        }

        // Check for webpage indicators
        if (lowerCitation.includes('retrieved from') || lowerCitation.includes('accessed') ||
            lowerCitation.includes('http') || lowerCitation.includes('www.')) {
            return 'webpage';
        }

        // Check for book chapter indicators
        if (lowerCitation.includes('in ') && (lowerCitation.includes('(eds.)') ||
            lowerCitation.includes('(ed.)') || lowerCitation.includes('editor'))) {
            return 'book-chapter';
        }

        // Check for journal article indicators (volume/issue patterns)
        if (this.patterns.volumeIssue.test(citation) || lowerCitation.includes('journal') ||
            lowerCitation.includes('vol.') || citation.includes('(') && citation.includes(')')) {
            return 'journal-article';
        }

        // Default to book if no specific indicators found
        return 'book';
    }

    /**
     * Parse journal article citation
     */
    parseJournalArticle(citation) {
        const data = {
            authors: [],
            title: '',
            journal: '',
            year: null,
            volume: '',
            issue: '',
            pages: '',
            doi: '',
            publisher: '',
            issn: '',
            url: ''
        };

        // Extract authors - handle multiple authors with initials
        const multipleAuthorsMatch = citation.match(this.patterns.multipleAuthors);
        if (multipleAuthorsMatch) {
            data.authors = this.parseAuthors(multipleAuthorsMatch[1]);
        } else {
            const authorMatch = citation.match(this.patterns.author);
            if (authorMatch) {
                data.authors = this.parseAuthors(authorMatch[1]);
            }
        }

        // Extract year - try multiple patterns
        let yearMatch = citation.match(this.patterns.yearInText); // .2016;
        if (!yearMatch) {
            yearMatch = citation.match(this.patterns.year); // (2016)
        }
        if (!yearMatch) {
            yearMatch = citation.match(/(\d{4})/); // any 4-digit number
        }
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract title - between first and second period
        const parts = citation.split('.');
        if (parts.length >= 3) {
            // Remove author part from first segment
            let titlePart = parts[1];
            if (titlePart) {
                data.title = titlePart.trim();
            }
        }

        // Extract journal name - between title and year
        if (parts.length >= 3) {
            const journalPart = parts[2];
            if (journalPart) {
                // Remove year and volume info to get clean journal name
                const journalMatch = journalPart.match(/^([^0-9;]+)/);
                if (journalMatch) {
                    data.journal = journalMatch[1].trim();
                }
            }
        }

        // Extract volume and issue - look for pattern like "5(6)"
        const volumeIssueMatch = citation.match(/(\d+)\((\d+)\)/);
        if (volumeIssueMatch) {
            data.volume = volumeIssueMatch[1];
            data.issue = volumeIssueMatch[2];
        }

        // Extract pages - look for pattern after colon
        const pagesMatch = citation.match(this.patterns.pagesWithColon);
        if (pagesMatch) {
            data.pages = pagesMatch[1];
        } else {
            // Try alternative patterns
            const altPagesMatch = citation.match(/(\d+-\d+)\.?\s*$/);
            if (altPagesMatch) {
                data.pages = altPagesMatch[1];
            }
        }

        // Extract DOI
        const doiMatch = citation.match(this.patterns.doi);
        if (doiMatch) {
            data.doi = doiMatch[1];
        }

        // Extract URL
        const urlMatch = citation.match(this.patterns.url);
        if (urlMatch) {
            data.url = urlMatch[0];
        }

        // Extract ISSN
        const issnMatch = citation.match(this.patterns.issn);
        if (issnMatch) {
            data.issn = issnMatch[1];
        }

        return data;
    }

    /**
     * Parse book citation
     */
    parseBook(citation) {
        const data = {
            authors: [],
            title: '',
            publisher: '',
            year: null,
            edition: '',
            isbn: '',
            pages: '',
            doi: '',
            url: ''
        };

        // Extract authors and year
        const authorMatch = citation.match(this.patterns.authorWithYear);
        if (authorMatch) {
            data.authors = this.parseAuthors(authorMatch[1]);
            data.year = parseInt(authorMatch[2]);
        } else {
            const authorOnlyMatch = citation.match(this.patterns.author);
            if (authorOnlyMatch) {
                data.authors = this.parseAuthors(authorOnlyMatch[1]);
            }

            const yearMatch = citation.match(this.patterns.year);
            if (yearMatch) {
                data.year = parseInt(yearMatch[1]);
            }
        }

        // Extract title (usually in italics or after author)
        const titleMatch = citation.match(/\.\s*([^.]+)\./);
        if (titleMatch) {
            data.title = titleMatch[1].trim();
        }

        // Extract publisher
        const publisherMatch = citation.match(/:\s*([^,]+),?\s*\d{4}/);
        if (publisherMatch) {
            data.publisher = publisherMatch[1].trim();
        }

        // Extract edition
        const editionMatch = citation.match(/(\d+(?:st|nd|rd|th)?\s*ed\.)/i);
        if (editionMatch) {
            data.edition = editionMatch[1];
        }

        // Extract ISBN
        const isbnMatch = citation.match(this.patterns.isbn);
        if (isbnMatch) {
            data.isbn = isbnMatch[1];
        }

        // Extract DOI
        const doiMatch = citation.match(this.patterns.doi);
        if (doiMatch) {
            data.doi = doiMatch[1];
        }

        // Extract URL
        const urlMatch = citation.match(this.patterns.url);
        if (urlMatch) {
            data.url = urlMatch[0];
        }

        return data;
    }

    /**
     * Parse book chapter citation
     */
    parseBookChapter(citation) {
        const data = {
            authors: [],
            title: '',
            book_title: '',
            editors: [],
            publisher: '',
            year: null,
            edition: '',
            chapter: '',
            pages: '',
            isbn: '',
            doi: '',
            url: ''
        };

        // Extract authors
        const authorMatch = citation.match(this.patterns.author);
        if (authorMatch) {
            data.authors = this.parseAuthors(authorMatch[1]);
        }

        // Extract year
        const yearMatch = citation.match(this.patterns.year);
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract chapter title
        const chapterTitleMatch = citation.match(/"([^"]+)"/);
        if (chapterTitleMatch) {
            data.title = chapterTitleMatch[1];
        }

        // Extract book title (usually after "In")
        const bookTitleMatch = citation.match(/In\s+([^(]+)/);
        if (bookTitleMatch) {
            data.book_title = bookTitleMatch[1].trim();
        }

        // Extract editors
        const editorMatch = citation.match(/\((?:Eds?\.|editors?)\s*([^)]+)\)/i);
        if (editorMatch) {
            data.editors = this.parseAuthors(editorMatch[1]);
        }

        return data;
    }

    /**
     * Parse conference paper citation
     */
    parseConferencePaper(citation) {
        const data = {
            authors: [],
            title: '',
            conference_name: '',
            publisher: '',
            year: null,
            location: '',
            pages: '',
            doi: '',
            url: ''
        };

        // Extract authors
        const authorMatch = citation.match(this.patterns.author);
        if (authorMatch) {
            data.authors = this.parseAuthors(authorMatch[1]);
        }

        // Extract year
        const yearMatch = citation.match(this.patterns.year);
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract title
        const titleMatch = citation.match(/"([^"]+)"/);
        if (titleMatch) {
            data.title = titleMatch[1];
        }

        // Extract conference name
        const confMatch = citation.match(/(?:Proceedings of|In)\s+([^,]+)/i);
        if (confMatch) {
            data.conference_name = confMatch[1].trim();
        }

        return data;
    }

    /**
     * Parse thesis citation
     */
    parseThesis(citation) {
        const data = {
            author: '',
            title: '',
            type: '',
            institution: '',
            year: null,
            doi: '',
            url: ''
        };

        // Extract author
        const authorMatch = citation.match(this.patterns.author);
        if (authorMatch) {
            data.author = authorMatch[1];
        }

        // Extract year
        const yearMatch = citation.match(this.patterns.year);
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract title
        const titleMatch = citation.match(/"([^"]+)"/);
        if (titleMatch) {
            data.title = titleMatch[1];
        }

        // Extract thesis type
        if (citation.toLowerCase().includes('phd') || citation.toLowerCase().includes('doctoral')) {
            data.type = 'PhD thesis';
        } else if (citation.toLowerCase().includes('master')) {
            data.type = 'Master\'s thesis';
        } else {
            data.type = 'thesis';
        }

        return data;
    }

    /**
     * Parse report citation
     */
    parseReport(citation) {
        const data = {
            authors: [],
            title: '',
            institution: '',
            year: null,
            report_number: '',
            pages: '',
            doi: '',
            url: ''
        };

        // Extract authors (may be at beginning or organization names)
        const authorMatch = citation.match(this.patterns.author);
        if (authorMatch) {
            data.authors = this.parseAuthors(authorMatch[1]);
        }

        // Extract year (can be at end or in parentheses)
        const yearMatch = citation.match(this.patterns.year) || citation.match(/(\d{4})\.?\s*$/);
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract title - handle cases without quotes
        let titleMatch = citation.match(/"([^"]+)"/);
        if (!titleMatch) {
            // Try to extract title from the beginning of the citation
            // Handle format: "Title. Institution, Year"
            const parts = citation.split('.');
            if (parts.length >= 2) {
                data.title = parts[0].trim();

                // Try to extract institution from the remaining part
                const remainingPart = parts.slice(1).join('.').trim();
                const institutionMatch = remainingPart.match(/^([^,]+)/);
                if (institutionMatch) {
                    data.institution = institutionMatch[1].trim();
                }
            }
        } else {
            data.title = titleMatch[1];
        }

        // Extract institution - look for common patterns
        if (!data.institution) {
            // Look for common institutional abbreviations
            const institutionPatterns = [
                /\b(NHM|GOI|WHO|CDC|NIH|NHS|UNICEF|UNESCO)\b/gi,
                /\b([A-Z]{2,})\b/g, // Any uppercase abbreviation
                /,\s*([^,]+),\s*\d{4}/ // Institution between commas before year
            ];

            for (const pattern of institutionPatterns) {
                const match = citation.match(pattern);
                if (match) {
                    data.institution = match[1];
                    break;
                }
            }
        }

        // Extract DOI
        const doiMatch = citation.match(this.patterns.doi);
        if (doiMatch) {
            data.doi = doiMatch[1];
        }

        // Extract URL
        const urlMatch = citation.match(this.patterns.url);
        if (urlMatch) {
            data.url = urlMatch[0];
        }

        return data;
    }

    /**
     * Parse webpage citation
     */
    parseWebpage(citation) {
        const data = {
            authors: [],
            title: '',
            website: '',
            year: null,
            month: '',
            day: '',
            url: '',
            accessed: ''
        };

        // Extract authors
        const authorMatch = citation.match(this.patterns.author);
        if (authorMatch) {
            data.authors = this.parseAuthors(authorMatch[1]);
        }

        // Extract year
        const yearMatch = citation.match(this.patterns.year);
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract URL
        const urlMatch = citation.match(this.patterns.url);
        if (urlMatch) {
            data.url = urlMatch[0];
        }

        // Extract accessed date
        const accessedMatch = citation.match(/(?:retrieved|accessed)\s+([^.]+)/i);
        if (accessedMatch) {
            data.accessed = accessedMatch[1].trim();
        }

        return data;
    }

    /**
     * Generic parser for unidentified citation types
     */
    parseGeneric(citation) {
        const data = {
            authors: [],
            title: '',
            year: null,
            doi: '',
            url: ''
        };

        // Extract authors
        const authorMatch = citation.match(this.patterns.author);
        if (authorMatch) {
            data.authors = this.parseAuthors(authorMatch[1]);
        }

        // Extract year
        const yearMatch = citation.match(this.patterns.year);
        if (yearMatch) {
            data.year = parseInt(yearMatch[1]);
        }

        // Extract DOI
        const doiMatch = citation.match(this.patterns.doi);
        if (doiMatch) {
            data.doi = doiMatch[1];
        }

        // Extract URL
        const urlMatch = citation.match(this.patterns.url);
        if (urlMatch) {
            data.url = urlMatch[0];
        }

        return data;
    }

    /**
     * Parse authors string into array
     * @param {string} authorString - The authors string to parse
     * @returns {Array} - Array of author names
     */
    parseAuthors(authorString) {
        if (!authorString) return [];

        // Handle format like "Nehara HR, Meena SL, Parmer S"
        // Split by comma and handle last name + initials format
        const authors = authorString
            .split(',')
            .map(author => author.trim())
            .filter(author => author.length > 0);

        // Also handle "&" and "and" separators
        const expandedAuthors = [];
        for (let author of authors) {
            if (author.includes(' & ')) {
                expandedAuthors.push(...author.split(' & ').map(a => a.trim()));
            } else if (author.includes(' and ')) {
                expandedAuthors.push(...author.split(' and ').map(a => a.trim()));
            } else {
                expandedAuthors.push(author);
            }
        }

        return expandedAuthors.filter(author => author.length > 0);
    }
}

// Usage example and test function
function testCitationParser() {
    const parser = new CitationParser();

    // Test citations
    const testCitations = [
        'WHO dengue guidelines for diagnosis, treatment, prevention and control, WHO, Geneva,\ Switzerland.2009'
    ];

    testCitations.forEach((citation, index) => {
        console.log(`\n--- Test Citation ${index + 1} ---`);
        console.log(`Original: ${citation}`);
        const result = parser.parseCitation(citation);
        console.log(`Type: ${result.type}`);
        console.log(`Data:`, result.data);
    });
}

testCitationParser()

