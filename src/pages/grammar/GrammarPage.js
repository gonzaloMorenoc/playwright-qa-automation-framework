const BasePage = require('../base/BasePage');

class GrammarPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.pageTitle = 'h1, h2';
    this.grammarContainer = '.grammar-container';
    this.lessonList = '.lesson-list';
    this.lessonItem = '.lesson-item';
    this.startLessonButton = '.start-lesson-btn';
    this.lessonContent = '.lesson-content';
    this.nextLessonButton = '#next-lesson-btn';
    this.previousLessonButton = '#previous-lesson-btn';
    this.lessonProgress = '.lesson-progress';
    this.exerciseSection = '.exercise-section';
    this.submitExerciseButton = '#submit-exercise-btn';
  }

  async navigateToGrammar() {
    await this.navigate('/public/grammar.html');
  }

  async isGrammarPageLoaded() {
    return await this.isElementVisible(this.pageTitle);
  }

  async getLessonsCount() {
    if (await this.isElementVisible(this.lessonItem)) {
      const lessons = await this.page.locator(this.lessonItem);
      return await lessons.count();
    }
    return 0;
  }

  async clickFirstLesson() {
    if (await this.isElementVisible(this.startLessonButton)) {
      await this.page.locator(this.startLessonButton).first().click();
    }
  }

  async isLessonContentVisible() {
    return await this.isElementVisible(this.lessonContent);
  }

  async clickNextLesson() {
    if (await this.isElementVisible(this.nextLessonButton)) {
      await this.clickElement(this.nextLessonButton);
    }
  }

  async isExerciseSectionVisible() {
    return await this.isElementVisible(this.exerciseSection);
  }

  async submitExercise() {
    if (await this.isElementVisible(this.submitExerciseButton)) {
      await this.clickElement(this.submitExerciseButton);
    }
  }
}

module.exports = GrammarPage;